package br.unitins.armas.service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import br.unitins.armas.dto.TokensKeycloak;
import br.unitins.armas.exception.CampoInvalidoException;
import br.unitins.armas.exception.KeycloakIndisponivelException;
import br.unitins.armas.exception.NaoAutenticadoException;
import br.unitins.armas.exception.RegraNegocioException;
import br.unitins.armas.model.Perfil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

// TODA a conversa com o Keycloak passa por aqui (o Angular nunca fala com o Keycloak).
//
// Usa dois "clients" do realm armas:
//  - armas-backend: faz o login dos usuários (OAuth 2.0 / OIDC, grant "password") e o logout
//  - armas-admin:   "robô" com permissão de gerenciar usuários (grant "client_credentials"),
//                   usado no cadastro, para dar o papel ADMIN/CLIENTE e para desativar contas
@ApplicationScoped
public class KeycloakService {

    private static final Logger LOG = Logger.getLogger(KeycloakService.class);

    @ConfigProperty(name = "armas.keycloak.url")
    String url;

    @ConfigProperty(name = "armas.keycloak.realm")
    String realm;

    @ConfigProperty(name = "armas.keycloak.login.client-id")
    String loginClientId;

    @ConfigProperty(name = "armas.keycloak.login.secret")
    String loginSecret;

    @ConfigProperty(name = "armas.keycloak.admin.client-id")
    String adminClientId;

    @ConfigProperty(name = "armas.keycloak.admin.secret")
    String adminSecret;

    @Inject
    ObjectMapper mapper;

    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    // token do "robô" armas-admin (guardado até perto de vencer, para não pedir toda hora)
    private String tokenAdmin;
    private Instant tokenAdminVenceEm = Instant.MIN;

    // =====================================================================
    // LOGIN, RENOVAÇÃO E LOGOUT (endpoints OpenID Connect do realm)
    // =====================================================================

    // troca e-mail + senha por tokens
    public TokensKeycloak entrar(String email, String senha) {
        Map<String, String> form = new LinkedHashMap<>();
        form.put("grant_type", "password");
        form.put("client_id", loginClientId);
        form.put("client_secret", loginSecret);
        form.put("username", email.trim().toLowerCase());
        form.put("password", senha);
        form.put("scope", "openid");

        HttpResponse<String> resposta = postarFormulario(urlOidc("token"), form);

        if (resposta.statusCode() == 200)
            return lerTokens(resposta.body());

        if (resposta.statusCode() == 400 || resposta.statusCode() == 401) {
            String descricao = lerJson(resposta.body()).path("error_description").asText("").toLowerCase();

            if (descricao.contains("disabled"))
                throw new CampoInvalidoException("email", "Este usuário está desativado. Fale com o administrador.");

            if (descricao.contains("not fully set up"))
                throw new RegraNegocioException("A conta ainda tem pendências no Keycloak (ex.: trocar senha). Fale com o administrador.");

            // mesma mensagem para e-mail errado e senha errada: não dá pista para quem tenta adivinhar
            throw new CampoInvalidoException("senha", "E-mail ou senha incorretos.");
        }

        throw erroInesperado("login", resposta);
    }

    // pede tokens novos usando o refresh token (sem pedir a senha de novo)
    public TokensKeycloak renovar(String refreshToken) {
        Map<String, String> form = new LinkedHashMap<>();
        form.put("grant_type", "refresh_token");
        form.put("client_id", loginClientId);
        form.put("client_secret", loginSecret);
        form.put("refresh_token", refreshToken);

        HttpResponse<String> resposta = postarFormulario(urlOidc("token"), form);

        if (resposta.statusCode() == 200)
            return lerTokens(resposta.body());

        if (resposta.statusCode() == 400 || resposta.statusCode() == 401)
            throw new NaoAutenticadoException("Sua sessão expirou. Entre novamente.");

        throw erroInesperado("renovação do token", resposta);
    }

    // logout: o Keycloak encerra a sessão e o refresh token deixa de valer
    public void encerrarSessao(String refreshToken) {
        Map<String, String> form = new LinkedHashMap<>();
        form.put("client_id", loginClientId);
        form.put("client_secret", loginSecret);
        form.put("refresh_token", refreshToken);

        HttpResponse<String> resposta = postarFormulario(urlOidc("logout"), form);

        // 204 = saiu; 400 = a sessão já tinha acabado (para o usuário dá no mesmo)
        if (resposta.statusCode() != 204 && resposta.statusCode() != 400)
            LOG.warnf("Logout no Keycloak respondeu %d: %s", resposta.statusCode(), resposta.body());
    }

    // lê o conteúdo (a parte do meio) de um token que acabou de vir do Keycloak.
    // não precisa conferir a assinatura aqui: o back recebeu o token direto do Keycloak.
    // (os tokens que chegam do Angular são conferidos pelo quarkus-oidc)
    public JsonNode lerConteudoDoToken(String token) {
        String[] partes = token.split("\\.");
        if (partes.length < 2)
            throw new NaoAutenticadoException("Token inválido.");
        byte[] json = Base64.getUrlDecoder().decode(partes[1]);
        return lerJson(new String(json, StandardCharsets.UTF_8));
    }

    // =====================================================================
    // ADMINISTRAÇÃO DE USUÁRIOS (Admin REST API do Keycloak)
    // =====================================================================

    // cria o usuário no Keycloak (com senha) e já dá o papel; devolve o id do Keycloak
    public String criarUsuario(String nome, String email, String senha, Perfil perfil) {
        String[] partesNome = separarNome(nome);

        ObjectNode usuario = mapper.createObjectNode();
        usuario.put("username", email);
        usuario.put("email", email);
        usuario.put("firstName", partesNome[0]);
        usuario.put("lastName", partesNome[1]);
        usuario.put("enabled", true);
        usuario.put("emailVerified", true);

        ObjectNode credencial = usuario.putArray("credentials").addObject();
        credencial.put("type", "password");
        credencial.put("value", senha);
        credencial.put("temporary", false);

        HttpResponse<String> resposta = enviarAdmin("POST", "/users", usuario.toString());

        if (resposta.statusCode() == 409)
            throw new CampoInvalidoException("email", "Já existe uma conta com esse e-mail.");

        if (resposta.statusCode() == 400) {
            String motivo = lerJson(resposta.body()).path("errorMessage").asText("dados inválidos");
            throw new RegraNegocioException("O Keycloak recusou o cadastro: " + motivo);
        }

        if (resposta.statusCode() != 201)
            throw erroInesperado("cadastro de usuário", resposta);

        // o id do usuário novo vem no fim do cabeçalho Location: .../users/{id}
        String location = resposta.headers().firstValue("Location")
                .orElseThrow(() -> new KeycloakIndisponivelException("O Keycloak não devolveu o id do usuário criado."));
        String id = location.substring(location.lastIndexOf('/') + 1);

        try {
            darPapel(id, perfil);
        } catch (RuntimeException e) {
            removerUsuario(id); // não deixa usuário "pela metade" no Keycloak
            throw e;
        }
        return id;
    }

    // ADMIN ou CLIENTE (realm roles)
    public void darPapel(String idKeycloak, Perfil perfil) {
        HttpResponse<String> papel = enviarAdmin("GET", "/roles/" + perfil.name(), null);
        if (papel.statusCode() != 200)
            throw erroInesperado("busca do papel " + perfil.name(), papel);

        String lista = "[" + papel.body() + "]";
        HttpResponse<String> resposta = enviarAdmin("POST", "/users/" + idKeycloak + "/role-mappings/realm", lista);
        if (resposta.statusCode() != 204)
            throw erroInesperado("atribuição do papel " + perfil.name(), resposta);
    }

    // troca a senha do usuário lá no Keycloak
    public void definirSenha(String idKeycloak, String novaSenha) {
        ObjectNode credencial = mapper.createObjectNode();
        credencial.put("type", "password");
        credencial.put("value", novaSenha);
        credencial.put("temporary", false);

        HttpResponse<String> resposta = enviarAdmin("PUT", "/users/" + idKeycloak + "/reset-password", credencial.toString());

        if (resposta.statusCode() == 400) {
            String motivo = lerJson(resposta.body()).path("errorMessage").asText("senha inválida");
            throw new CampoInvalidoException("novaSenha", "O Keycloak recusou a nova senha: " + motivo);
        }
        if (resposta.statusCode() != 204)
            throw erroInesperado("troca de senha", resposta);
    }

    // derruba todas as sessões abertas do usuário (ex.: depois de redefinir a senha)
    public void encerrarSessoesDoUsuario(String idKeycloak) {
        HttpResponse<String> resposta = enviarAdmin("POST", "/users/" + idKeycloak + "/logout", null);
        if (resposta.statusCode() != 204)
            LOG.warnf("Não foi possível encerrar as sessões do usuário %s (HTTP %d)", idKeycloak, resposta.statusCode());
    }

    // ativa ou desativa o login da pessoa; ao desativar, derruba as sessões abertas
    public void alterarAtivo(String idKeycloak, boolean ativo) {
        HttpResponse<String> atual = enviarAdmin("GET", "/users/" + idKeycloak, null);
        if (atual.statusCode() == 404)
            return; // não existe no Keycloak: nada a fazer
        if (atual.statusCode() != 200)
            throw erroInesperado("busca do usuário", atual);

        ObjectNode usuario = (ObjectNode) lerJson(atual.body());
        usuario.put("enabled", ativo);

        HttpResponse<String> resposta = enviarAdmin("PUT", "/users/" + idKeycloak, usuario.toString());
        if (resposta.statusCode() != 204)
            throw erroInesperado("alteração do usuário", resposta);

        if (!ativo)
            enviarAdmin("POST", "/users/" + idKeycloak + "/logout", null);
    }

    public void removerUsuario(String idKeycloak) {
        try {
            enviarAdmin("DELETE", "/users/" + idKeycloak, null);
        } catch (RuntimeException e) {
            LOG.warnf("Não foi possível remover o usuário %s do Keycloak: %s", idKeycloak, e.getMessage());
        }
    }

    // procura o id do Keycloak pelo e-mail (null se não achar)
    public String buscarIdPorEmail(String email) {
        String filtro = URLEncoder.encode(email.trim().toLowerCase(), StandardCharsets.UTF_8);
        HttpResponse<String> resposta = enviarAdmin("GET", "/users?exact=true&email=" + filtro, null);
        if (resposta.statusCode() != 200)
            throw erroInesperado("busca de usuário por e-mail", resposta);

        JsonNode lista = lerJson(resposta.body());
        return lista.isArray() && lista.size() > 0 ? lista.get(0).path("id").asText(null) : null;
    }

    // =====================================================================
    // AJUDANTES
    // =====================================================================

    private HttpResponse<String> enviarAdmin(String metodo, String caminho, String corpoJson) {
        HttpRequest.Builder requisicao = HttpRequest.newBuilder()
                .uri(URI.create(url + "/admin/realms/" + realm + caminho))
                .timeout(Duration.ofSeconds(10))
                .header("Authorization", "Bearer " + tokenDoAdmin());

        if (corpoJson != null) {
            requisicao.header("Content-Type", "application/json");
            requisicao.method(metodo, HttpRequest.BodyPublishers.ofString(corpoJson));
        } else {
            requisicao.method(metodo, HttpRequest.BodyPublishers.noBody());
        }

        HttpResponse<String> resposta = enviar(requisicao.build());

        // o token do robô pode ter vencido no meio do caminho: pede outro e tenta uma vez de novo
        if (resposta.statusCode() == 401) {
            tokenAdminVenceEm = Instant.MIN;
            requisicao.setHeader("Authorization", "Bearer " + tokenDoAdmin());
            resposta = enviar(requisicao.build());
        }
        if (resposta.statusCode() == 403)
            throw new KeycloakIndisponivelException(
                    "O client armas-admin não tem permissão para gerenciar usuários no Keycloak (confira as service account roles).");
        return resposta;
    }

    // login do "robô" armas-admin (client_credentials)
    private synchronized String tokenDoAdmin() {
        if (tokenAdmin != null && Instant.now().isBefore(tokenAdminVenceEm))
            return tokenAdmin;

        Map<String, String> form = new LinkedHashMap<>();
        form.put("grant_type", "client_credentials");
        form.put("client_id", adminClientId);
        form.put("client_secret", adminSecret);

        HttpResponse<String> resposta = postarFormulario(urlOidc("token"), form);
        if (resposta.statusCode() != 200)
            throw erroInesperado("login do client armas-admin", resposta);

        TokensKeycloak tokens = lerTokens(resposta.body());
        tokenAdmin = tokens.accessToken();
        tokenAdminVenceEm = Instant.now().plusSeconds(Math.max(tokens.expiraEm() - 30, 10));
        return tokenAdmin;
    }

    private HttpResponse<String> postarFormulario(String endereco, Map<String, String> campos) {
        String corpo = campos.entrySet().stream()
                .map(c -> URLEncoder.encode(c.getKey(), StandardCharsets.UTF_8) + "="
                        + URLEncoder.encode(c.getValue(), StandardCharsets.UTF_8))
                .collect(Collectors.joining("&"));

        HttpRequest requisicao = HttpRequest.newBuilder()
                .uri(URI.create(endereco))
                .timeout(Duration.ofSeconds(10))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(corpo))
                .build();
        return enviar(requisicao);
    }

    private HttpResponse<String> enviar(HttpRequest requisicao) {
        try {
            return http.send(requisicao, HttpResponse.BodyHandlers.ofString());
        } catch (IOException e) {
            throw new KeycloakIndisponivelException(
                    "Não foi possível falar com o Keycloak em " + url + ". Confira se o container está rodando.", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new KeycloakIndisponivelException("A conversa com o Keycloak foi interrompida.", e);
        }
    }

    private String urlOidc(String endpoint) {
        return url + "/realms/" + realm + "/protocol/openid-connect/" + endpoint;
    }

    private TokensKeycloak lerTokens(String corpo) {
        JsonNode json = lerJson(corpo);
        return new TokensKeycloak(
                json.path("access_token").asText(),
                json.path("refresh_token").asText(null),
                json.path("expires_in").asLong(300));
    }

    private JsonNode lerJson(String corpo) {
        try {
            return corpo == null || corpo.isBlank() ? mapper.createObjectNode() : mapper.readTree(corpo);
        } catch (IOException e) {
            return mapper.createObjectNode();
        }
    }

    private KeycloakIndisponivelException erroInesperado(String operacao, HttpResponse<String> resposta) {
        LOG.errorf("Keycloak respondeu %d (%s): %s", resposta.statusCode(), operacao, resposta.body());
        return new KeycloakIndisponivelException("Erro no Keycloak (" + operacao + ", HTTP " + resposta.statusCode() + ").");
    }

    // "Yasmin Gothe" -> ["Yasmin", "Gothe"]; nome de uma palavra só repete no sobrenome
    // (o Keycloak exige nome e sobrenome para a conta ficar completa)
    private String[] separarNome(String nome) {
        String limpo = nome.trim().replaceAll("\\s+", " ");
        int espaco = limpo.indexOf(' ');
        if (espaco < 0)
            return new String[] { limpo, limpo };
        return new String[] { limpo.substring(0, espaco), limpo.substring(espaco + 1) };
    }

    // papéis (ADMIN / CLIENTE) que estão no token, em realm_access.roles
    public List<String> papeisDoToken(JsonNode conteudo) {
        List<String> papeis = new ArrayList<>();
        conteudo.path("realm_access").path("roles").forEach(p -> papeis.add(p.asText()));
        return papeis;
    }
}

package br.unitins.armas.service;

import com.fasterxml.jackson.databind.JsonNode;

import br.unitins.armas.dto.AlterarSenhaDTO;
import br.unitins.armas.dto.CadastroContaDTO;
import br.unitins.armas.dto.LoginDTO;
import br.unitins.armas.dto.TokenResponseDTO;
import br.unitins.armas.dto.TokensKeycloak;
import br.unitins.armas.dto.UsuarioResponseDTO;
import br.unitins.armas.exception.CampoInvalidoException;
import br.unitins.armas.exception.NaoAutenticadoException;
import br.unitins.armas.model.Perfil;
import br.unitins.armas.model.Usuario;
import br.unitins.armas.repository.UsuarioRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

// login, cadastro, renovação e logout: o Angular chama ESTE back,
// e o back conversa com o Keycloak (o Angular nunca fala com o Keycloak direto)
@ApplicationScoped
public class AuthServiceImpl implements AuthService {

    @Inject
    UsuarioRepository repository;

    @Inject
    KeycloakService keycloak;

    @Override
    @Transactional
    public TokenResponseDTO login(LoginDTO dto) {
        Usuario local = repository.findByEmail(dto.email());
        if (local != null && !local.getAtivo())
            throw new CampoInvalidoException("email", "Este usuário está desativado. Fale com o administrador.");

        // quem confere a senha é o Keycloak
        TokensKeycloak tokens = keycloak.entrar(dto.email(), dto.senha());
        return responder(tokens);
    }

    @Override
    @Transactional
    public TokenResponseDTO cadastrar(CadastroContaDTO dto) {
        String email = dto.email().trim().toLowerCase();
        if (repository.existeEmail(email, null))
            throw new CampoInvalidoException("email", "Já existe uma conta com esse e-mail.");

        // 1) cria no Keycloak (a senha fica lá) com o papel CLIENTE
        String idKeycloak = keycloak.criarUsuario(dto.nome().trim(), email, dto.senha(), Perfil.CLIENTE);

        // 2) cria no nosso banco SEM senha, só ligado pelo id do Keycloak
        try {
            Usuario usuario = new Usuario();
            usuario.setNome(dto.nome().trim());
            usuario.setEmail(email);
            usuario.setPerfil(Perfil.CLIENTE); // quem se cadastra pela loja é sempre cliente
            usuario.setKeycloakId(idKeycloak);
            repository.persistAndFlush(usuario);
        } catch (RuntimeException e) {
            keycloak.removerUsuario(idKeycloak); // deu erro no banco: desfaz no Keycloak também
            throw e;
        }

        // 3) já entra na conta nova
        return responder(keycloak.entrar(email, dto.senha()));
    }

    @Override
    @Transactional
    public TokenResponseDTO renovar(String refreshToken) {
        TokenResponseDTO resposta = responder(keycloak.renovar(refreshToken));
        if (!resposta.usuario().ativo()) {
            keycloak.encerrarSessao(refreshToken);
            throw new NaoAutenticadoException("Este usuário está desativado.");
        }
        return resposta;
    }

    @Override
    public void sair(String refreshToken) {
        keycloak.encerrarSessao(refreshToken);
    }

    @Override
    public void alterarSenha(Usuario usuario, AlterarSenhaDTO dto) {
        if (dto.senhaAtual().equals(dto.novaSenha()))
            throw new CampoInvalidoException("novaSenha", "A nova senha deve ser diferente da atual.");

        // 1) confere a senha atual pedindo um login ao Keycloak (se errar, ele recusa)
        TokensKeycloak conferencia;
        try {
            conferencia = keycloak.entrar(usuario.getEmail(), dto.senhaAtual());
        } catch (CampoInvalidoException e) {
            throw new CampoInvalidoException("senhaAtual", "Senha atual incorreta.");
        }
        // esse login foi só para conferir: encerra a sessão na hora
        keycloak.encerrarSessao(conferencia.refreshToken());

        // 2) troca a senha no Keycloak
        String idKeycloak = usuario.getKeycloakId() != null
                ? usuario.getKeycloakId()
                : keycloak.buscarIdPorEmail(usuario.getEmail());
        keycloak.definirSenha(idKeycloak, dto.novaSenha());
    }

    @Override
    @Transactional
    public Usuario sincronizar(String keycloakId, String email, String nome, boolean admin) {
        Usuario usuario = repository.findByKeycloakId(keycloakId);
        if (usuario != null)
            return usuario;

        if (email == null || email.isBlank())
            throw new NaoAutenticadoException("O token não tem o e-mail do usuário.");

        // primeira vez que entra: procura pelo e-mail e liga as duas contas
        usuario = repository.findByEmail(email);
        if (usuario != null) {
            usuario.setKeycloakId(keycloakId);
            return usuario;
        }

        // usuário criado direto no console do Keycloak: cria a "cópia" no nosso banco
        usuario = new Usuario();
        usuario.setNome(nome != null && !nome.isBlank() ? nome : email);
        usuario.setEmail(email.trim().toLowerCase());
        usuario.setPerfil(admin ? Perfil.ADMIN : Perfil.CLIENTE);
        usuario.setKeycloakId(keycloakId);
        repository.persist(usuario);
        return usuario;
    }

    // monta a resposta para o Angular: tokens + dados do usuário do nosso banco
    private TokenResponseDTO responder(TokensKeycloak tokens) {
        JsonNode conteudo = keycloak.lerConteudoDoToken(tokens.accessToken());
        Usuario usuario = sincronizar(
                conteudo.path("sub").asText(),
                conteudo.path("email").asText(conteudo.path("preferred_username").asText()),
                conteudo.path("name").asText(null),
                keycloak.papeisDoToken(conteudo).contains(Perfil.ADMIN.name()));

        return new TokenResponseDTO(tokens.accessToken(), tokens.refreshToken(), tokens.expiraEm(),
                UsuarioResponseDTO.valueOf(usuario));
    }
}

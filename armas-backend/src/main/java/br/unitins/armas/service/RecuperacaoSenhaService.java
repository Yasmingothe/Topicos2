package br.unitins.armas.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import br.unitins.armas.exception.RegraNegocioException;
import br.unitins.armas.model.RecuperacaoSenha;
import br.unitins.armas.model.Usuario;
import br.unitins.armas.repository.RecuperacaoSenhaRepository;
import br.unitins.armas.repository.UsuarioRepository;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

// "Esqueci minha senha":
// 1) a pessoa informa o e-mail -> o back gera um código e manda um link por e-mail
// 2) o link abre a tela de nova senha no Angular -> o back confere o código e troca a senha NO KEYCLOAK
@ApplicationScoped
public class RecuperacaoSenhaService {

    private static final Logger LOG = Logger.getLogger(RecuperacaoSenhaService.class);

    @Inject
    RecuperacaoSenhaRepository repository;

    @Inject
    UsuarioRepository usuarioRepository;

    @Inject
    KeycloakService keycloak;

    @Inject
    AuthService authService;

    @Inject
    Mailer mailer;

    @ConfigProperty(name = "armas.site.url")
    String urlSite;

    @ConfigProperty(name = "armas.recuperacao.validade-minutos", defaultValue = "30")
    int validadeMinutos;

    private final SecureRandom aleatorio = new SecureRandom();

    @Transactional
    public void solicitar(String email) {
        Usuario usuario = acharUsuario(email.trim().toLowerCase());

        // e-mail que não existe (ou conta desativada): não faz nada e não avisa,
        // para ninguém descobrir quais e-mails têm conta na loja
        if (usuario == null || !usuario.getAtivo()) {
            LOG.infof("Recuperação de senha pedida para %s, mas não há conta ativa com esse e-mail.", email);
            return;
        }

        RecuperacaoSenha pedido = new RecuperacaoSenha();
        pedido.setToken(gerarToken());
        pedido.setUsuario(usuario);
        pedido.setExpiraEm(LocalDateTime.now().plusMinutes(validadeMinutos));
        repository.persist(pedido);

        String link = urlSite + "/redefinir-senha?token=" + pedido.getToken();
        try {
            mailer.send(Mail.withHtml(usuario.getEmail(), "ZERO1 - Redefinir sua senha", corpoDoEmail(usuario, link)));
        } catch (RuntimeException e) {
            LOG.error("Falha ao enviar o e-mail de recuperação", e);
            throw new RegraNegocioException("Não foi possível enviar o e-mail agora. Confira se o Mailpit está rodando e tente de novo.");
        }
    }

    @Transactional
    public void redefinir(String token, String novaSenha) {
        RecuperacaoSenha pedido = repository.findByToken(token);

        if (pedido == null || pedido.getUsado() || pedido.getExpiraEm().isBefore(LocalDateTime.now()))
            throw new RegraNegocioException("Este link é inválido ou já expirou. Peça um novo em \"Esqueci minha senha\".");

        Usuario usuario = pedido.getUsuario();
        String idKeycloak = usuario.getKeycloakId() != null
                ? usuario.getKeycloakId()
                : keycloak.buscarIdPorEmail(usuario.getEmail());
        if (idKeycloak == null)
            throw new RegraNegocioException("Esta conta não foi encontrada no Keycloak.");

        // a senha nova vai para o Keycloak (no nosso banco não existe senha)
        keycloak.definirSenha(idKeycloak, novaSenha);
        // quem estava logado com a senha antiga é desconectado
        keycloak.encerrarSessoesDoUsuario(idKeycloak);

        pedido.setUsado(true);
    }

    // procura no nosso banco; se não achar (ex.: banco recriado), procura no Keycloak e cria a cópia
    private Usuario acharUsuario(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario != null)
            return usuario;

        String idKeycloak = keycloak.buscarIdPorEmail(email);
        if (idKeycloak == null)
            return null;
        return authService.sincronizar(idKeycloak, email, null, false);
    }

    // 48 bytes aleatórios em base64 (sem caracteres que estragam a URL)
    private String gerarToken() {
        byte[] bytes = new byte[48];
        aleatorio.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String corpoDoEmail(Usuario usuario, String link) {
        String primeiroNome = usuario.getNome().trim().split("\\s+")[0];
        return """
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #222;">
                  <h2 style="color: #d63a3a;">ZERO1</h2>
                  <p>Olá, %s!</p>
                  <p>Recebemos um pedido para redefinir a senha da sua conta.</p>
                  <p style="margin: 28px 0;">
                    <a href="%s" style="background: #d63a3a; color: #fff; padding: 12px 22px;
                       border-radius: 24px; text-decoration: none; font-weight: bold;">Criar nova senha</a>
                  </p>
                  <p>O link vale por %d minutos e só pode ser usado uma vez.</p>
                  <p style="color: #777; font-size: 13px;">Se não foi você que pediu, é só ignorar este e-mail: sua senha continua a mesma.</p>
                </div>
                """.formatted(primeiroNome, link, validadeMinutos);
    }
}

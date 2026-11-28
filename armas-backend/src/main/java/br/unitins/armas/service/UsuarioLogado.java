package br.unitins.armas.service;

import org.eclipse.microprofile.jwt.JsonWebToken;

import br.unitins.armas.exception.NaoAutenticadoException;
import br.unitins.armas.model.Perfil;
import br.unitins.armas.model.Usuario;
import io.quarkus.security.ForbiddenException;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.RequestScoped;
import jakarta.json.JsonString;
import jakarta.inject.Inject;

// "quem está fazendo esta requisição?"
// o quarkus-oidc já conferiu o token; aqui só achamos o usuário do nosso banco pelo "sub" (id do Keycloak)
@RequestScoped
public class UsuarioLogado {

    @Inject
    JsonWebToken token;

    @Inject
    SecurityIdentity identidade;

    @Inject
    AuthService authService;

    private Usuario usuario;

    public Usuario get() {
        if (usuario != null)
            return usuario;

        if (identidade.isAnonymous() || token.getSubject() == null)
            throw new NaoAutenticadoException("Faça login para continuar.");

        String email = texto("email");
        if (email == null)
            email = texto("preferred_username");
        String nome = texto("name");

        Usuario encontrado = authService.sincronizar(token.getSubject(), email, nome,
                identidade.hasRole(Perfil.ADMIN.name()));

        if (!encontrado.getAtivo())
            throw new ForbiddenException("Usuário desativado.");

        usuario = encontrado;
        return usuario;
    }

    // lê um campo do token como texto
    private String texto(String claim) {
        Object valor = token.getClaim(claim);
        if (valor == null)
            return null;
        if (valor instanceof JsonString json)
            return json.getString();
        return valor.toString();
    }

    public Long id() {
        return get().getId();
    }
}

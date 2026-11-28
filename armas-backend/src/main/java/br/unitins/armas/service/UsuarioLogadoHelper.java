package br.unitins.armas.service;

import java.util.Set;

import org.eclipse.microprofile.jwt.JsonWebToken;

import br.unitins.armas.model.Perfil;
import br.unitins.armas.model.Usuario;
import br.unitins.armas.repository.UsuarioRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotAuthorizedException;

@ApplicationScoped
public class UsuarioLogadoHelper {

    @Inject
    JsonWebToken jwt;

    @Inject
    UsuarioRepository usuarioRepository;

    @Transactional
    public Usuario getUsuarioLogado() {
        String sub = jwt.getSubject();
        if (sub == null || sub.isBlank()) {
            throw new NotAuthorizedException("Token sem identificador de sujeito (sub).");
        }

        Usuario usuario = usuarioRepository.findByKeycloakId(sub);
        if (usuario != null) {
            if (!usuario.getAtivo()) {
                throw new ForbiddenException("Este usuário está desativado.");
            }
            return usuario;
        }

        // Tenta resolver por e-mail se já existia na base local (ex.: seeds do import.sql)
        String email = jwt.getClaim("email");
        if (email != null && !email.isBlank()) {
            usuario = usuarioRepository.findByEmail(email);
            if (usuario != null) {
                usuario.setKeycloakId(sub);
                if (!usuario.getAtivo()) {
                    throw new ForbiddenException("Este usuário está desativado.");
                }
                return usuario;
            }
        }

        // Provisionamento Just-In-Time (JIT) para novos usuários registrados no Keycloak
        usuario = new Usuario();
        usuario.setKeycloakId(sub);
        usuario.setEmail(email != null && !email.isBlank() ? email.toLowerCase().trim() : sub);

        String nome = jwt.getClaim("name");
        if (nome == null || nome.isBlank()) {
            nome = jwt.getClaim("preferred_username");
        }
        if (nome == null || nome.isBlank()) {
            nome = "Usuário";
        }
        usuario.setNome(nome);

        Set<String> groups = jwt.getGroups();
        boolean isAdmin = groups != null && groups.contains("ADMIN");
        usuario.setPerfil(isAdmin ? Perfil.ADMIN : Perfil.CLIENTE);
        usuario.setAtivo(true);

        usuarioRepository.persist(usuario);
        return usuario;
    }

    public Long getIdUsuarioLogado() {
        return getUsuarioLogado().getId();
    }
}

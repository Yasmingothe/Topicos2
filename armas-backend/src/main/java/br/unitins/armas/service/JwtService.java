package br.unitins.armas.service;

import java.time.Duration;
import java.util.Set;

import br.unitins.armas.model.Usuario;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;

// gera o token JWT: o "crachá" que o front manda em toda requisição
@ApplicationScoped
public class JwtService {

    private static final Duration VALIDADE = Duration.ofHours(8);

    public String gerarToken(Usuario usuario) {
        return Jwt.issuer("armas-jwt")
                .subject(usuario.getId().toString())   // id do usuário
                .upn(usuario.getEmail())               // login
                .groups(Set.of(usuario.getPerfil().name())) // perfil: ADMIN ou CLIENTE (usado no @RolesAllowed)
                .claim("nome", usuario.getNome())
                .expiresIn(VALIDADE)
                .sign(); // assina com a chave privada (privateKey.pem)
    }
}

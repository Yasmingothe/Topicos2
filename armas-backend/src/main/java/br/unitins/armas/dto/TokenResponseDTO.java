package br.unitins.armas.dto;

// resposta do login: os tokens que o Keycloak gerou e quem é o usuário
// token        = access token (o "crachá" que vai em toda requisição; dura poucos minutos)
// refreshToken = serve para pedir um crachá novo sem digitar a senha de novo
// expiraEm     = quantos segundos o access token vale
public record TokenResponseDTO(
    String token,
    String refreshToken,
    long expiraEm,
    UsuarioResponseDTO usuario
) {
}

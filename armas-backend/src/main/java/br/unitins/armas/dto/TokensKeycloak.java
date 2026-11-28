package br.unitins.armas.dto;

// o que o Keycloak devolve no endpoint /token (só o que o sistema usa)
public record TokensKeycloak(
    String accessToken,
    String refreshToken,
    long expiraEm
) {
}

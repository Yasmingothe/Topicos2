package br.unitins.armas.dto;

import jakarta.validation.constraints.NotBlank;

// usado para renovar a sessão e para sair (logout)
public record RefreshTokenDTO(

    @NotBlank(message = "Informe o refresh token.")
    String refreshToken
) {
}

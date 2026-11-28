package br.unitins.armas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// tela de nova senha (aberta pelo link do e-mail)
public record RedefinirSenhaDTO(

    @NotBlank(message = "O link está incompleto. Abra de novo o link do e-mail.")
    String token,

    @NotBlank(message = "Informe a nova senha.")
    @Size(min = 6, max = 60, message = "A nova senha deve ter entre 6 e 60 caracteres.")
    String novaSenha
) {
}

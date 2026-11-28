package br.unitins.armas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

// "Esqueci minha senha": só o e-mail da conta
public record EsqueciSenhaDTO(

    @NotBlank(message = "Informe o e-mail.")
    @Email(message = "E-mail inválido.")
    String email
) {
}

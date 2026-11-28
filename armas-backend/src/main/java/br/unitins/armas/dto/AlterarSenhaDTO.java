package br.unitins.armas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// trocar a senha estando logado (a senha fica no Keycloak, não no nosso banco)
public record AlterarSenhaDTO(

    @NotBlank(message = "Informe a senha atual.")
    String senhaAtual,

    @NotBlank(message = "Informe a nova senha.")
    @Size(min = 6, max = 60, message = "A nova senha deve ter entre 6 e 60 caracteres.")
    String novaSenha
) {
}

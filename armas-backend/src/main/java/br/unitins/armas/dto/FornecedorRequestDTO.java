package br.unitins.armas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record FornecedorRequestDTO(

    @NotBlank(message = "Informe a razão social.")
    @Size(min = 2, max = 120, message = "A razão social deve ter entre 2 e 120 caracteres.")
    String razaoSocial,

    @Size(max = 80, message = "O nome fantasia deve ter no máximo 80 caracteres.")
    String nomeFantasia,

    @NotBlank(message = "Informe o CNPJ.")
    @Pattern(regexp = "\\d{14}", message = "O CNPJ deve ter 14 números.")
    String cnpj,

    @Email(message = "E-mail inválido.")
    @Size(max = 120, message = "O e-mail deve ter no máximo 120 caracteres.")
    String email,

    @Pattern(regexp = "(\\d{10,11})?", message = "O telefone deve ter DDD e número (10 ou 11 números).")
    String telefone,

    Boolean ativo
) {
}

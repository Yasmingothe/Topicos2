package br.unitins.armas.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ClienteRequestDTO(

    @NotBlank(message = "Informe o nome.")
    @Size(min = 2, max = 120, message = "O nome deve ter entre 2 e 120 caracteres.")
    String nome,

    @NotBlank(message = "Informe o e-mail.")
    @Email(message = "E-mail inválido.")
    @Size(max = 120, message = "O e-mail deve ter no máximo 120 caracteres.")
    String email,

    @NotBlank(message = "Informe o CPF.")
    @Pattern(regexp = "\\d{11}", message = "O CPF deve ter 11 números.")
    String cpf,

    @NotNull(message = "Informe a data de nascimento.")
    @Past(message = "A data de nascimento deve ser anterior a hoje.")
    LocalDate dataNascimento,

    @NotBlank(message = "Informe o telefone.")
    @Pattern(regexp = "\\d{10,11}", message = "O telefone deve ter DDD e número (10 ou 11 números).")
    String telefone,

    @NotBlank(message = "Informe o CEP.")
    @Pattern(regexp = "\\d{8}", message = "O CEP deve ter 8 números.")
    String cep,

    @NotBlank(message = "Informe o logradouro.")
    @Size(max = 120, message = "O logradouro deve ter no máximo 120 caracteres.")
    String logradouro,

    @NotBlank(message = "Informe o número.")
    @Size(max = 10, message = "O número deve ter no máximo 10 caracteres.")
    String numero,

    @Size(max = 60, message = "O complemento deve ter no máximo 60 caracteres.")
    String complemento,

    @NotBlank(message = "Informe o bairro.")
    @Size(max = 80, message = "O bairro deve ter no máximo 80 caracteres.")
    String bairro,

    @NotBlank(message = "Informe a cidade.")
    @Size(max = 80, message = "A cidade deve ter no máximo 80 caracteres.")
    String cidade,

    @NotBlank(message = "Informe a UF.")
    @Pattern(regexp = "[A-Za-z]{2}", message = "A UF deve ter 2 letras.")
    String uf
) {
}
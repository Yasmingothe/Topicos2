package br.unitins.armas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// cadastro de usuário feito pelo admin (pode criar outro admin)
public record UsuarioRequestDTO(

    @NotBlank(message = "Informe o nome.")
    @Size(min = 2, max = 120, message = "O nome deve ter entre 2 e 120 caracteres.")
    String nome,

    @NotBlank(message = "Informe o e-mail.")
    @Email(message = "E-mail inválido.")
    @Size(max = 120, message = "O e-mail deve ter no máximo 120 caracteres.")
    String email,

    @NotBlank(message = "Informe a senha.")
    @Size(min = 6, max = 60, message = "A senha deve ter entre 6 e 60 caracteres.")
    String senha,

    @NotBlank(message = "Selecione o perfil.")
    String perfil
) {
}

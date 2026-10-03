package br.unitins.armas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MarcaRequestDTO(

    @NotBlank(message = "Informe o nome da marca.")
    @Size(min = 2, max = 60, message = "O nome deve ter entre 2 e 60 caracteres.")
    String nome,

    @NotBlank(message = "Informe o país de origem.")
    @Size(max = 40, message = "O país deve ter no máximo 40 caracteres.")
    String paisOrigem,

    Boolean ativa
) {
}
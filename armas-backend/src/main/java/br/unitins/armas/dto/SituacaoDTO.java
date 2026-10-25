package br.unitins.armas.dto;

import jakarta.validation.constraints.NotBlank;

// usado para trocar a situação do pedido ou da autorização
public record SituacaoDTO(

    @NotBlank(message = "Informe a situação.")
    String situacao
) {
}

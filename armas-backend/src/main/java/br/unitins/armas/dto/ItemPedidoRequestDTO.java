package br.unitins.armas.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ItemPedidoRequestDTO(

    @NotNull(message = "Informe o produto.")
    Long idProduto,

    @NotNull(message = "Informe a quantidade.")
    @Min(value = 1, message = "A quantidade deve ser pelo menos 1.")
    @Max(value = 99, message = "A quantidade deve ser no máximo 99.")
    Integer quantidade
) {
}

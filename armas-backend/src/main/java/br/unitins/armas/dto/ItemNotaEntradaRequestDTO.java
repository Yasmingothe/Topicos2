package br.unitins.armas.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ItemNotaEntradaRequestDTO(

    @NotNull(message = "Selecione o produto.")
    Long idProduto,

    @NotNull(message = "Informe a quantidade.")
    @Min(value = 1, message = "A quantidade deve ser pelo menos 1.")
    @Max(value = 9999, message = "A quantidade deve ser no máximo 9999.")
    Integer quantidade,

    @NotNull(message = "Informe o custo unitário.")
    @DecimalMin(value = "0.01", message = "O custo deve ser maior que zero.")
    @Digits(integer = 8, fraction = 2, message = "Use no máximo 2 casas decimais no custo.")
    BigDecimal custoUnitario,

    // opcional: se vier vazio, o sistema gera um código de lote
    @Size(max = 30, message = "O código do lote deve ter no máximo 30 caracteres.")
    String codigoLote
) {
}

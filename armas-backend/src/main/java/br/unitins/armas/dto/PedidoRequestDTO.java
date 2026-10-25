package br.unitins.armas.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

// o pagamento é simulado: os dados do cartão NÃO vêm para o back
public record PedidoRequestDTO(

    @NotBlank(message = "Selecione a forma de pagamento.")
    String formaPagamento,

    @Min(value = 1, message = "As parcelas devem ser de 1 a 10.")
    @Max(value = 10, message = "As parcelas devem ser de 1 a 10.")
    Integer parcelas,

    @NotEmpty(message = "O carrinho está vazio.")
    List<@Valid ItemPedidoRequestDTO> itens
) {
}

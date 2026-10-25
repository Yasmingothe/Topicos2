package br.unitins.armas.dto;

import java.math.BigDecimal;

import br.unitins.armas.model.ItemNotaEntrada;

public record ItemNotaEntradaResponseDTO(
    Long id,
    ProdutoResumoDTO produto,
    Integer quantidade,
    BigDecimal custoUnitario,
    BigDecimal subtotal,
    Long idLote,
    String codigoLote,
    Integer quantidadeDisponivel
) {
    public static ItemNotaEntradaResponseDTO valueOf(ItemNotaEntrada item) {
        return new ItemNotaEntradaResponseDTO(
            item.getId(),
            ProdutoResumoDTO.valueOf(item.getProduto()),
            item.getQuantidade(),
            item.getCustoUnitario(),
            item.getSubtotal(),
            item.getLote().getId(),
            item.getLote().getCodigo(),
            item.getLote().getQuantidadeDisponivel()
        );
    }
}

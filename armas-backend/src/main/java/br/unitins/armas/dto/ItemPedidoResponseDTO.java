package br.unitins.armas.dto;

import java.math.BigDecimal;
import java.util.List;

import br.unitins.armas.model.ItemPedido;

public record ItemPedidoResponseDTO(
    Long id,
    ProdutoResumoDTO produto,
    Integer quantidade,
    BigDecimal precoUnitario,
    BigDecimal subtotal,
    List<LoteUsadoDTO> lotes
) {
    public record LoteUsadoDTO(Long idLote, String codigo, Integer quantidade) {
    }

    public static ItemPedidoResponseDTO valueOf(ItemPedido item) {
        return new ItemPedidoResponseDTO(
            item.getId(),
            ProdutoResumoDTO.valueOf(item.getProduto()),
            item.getQuantidade(),
            item.getPrecoUnitario(),
            item.getSubtotal(),
            item.getSaidas().stream()
                .map(s -> new LoteUsadoDTO(s.getLote().getId(), s.getLote().getCodigo(), s.getQuantidade()))
                .toList()
        );
    }
}

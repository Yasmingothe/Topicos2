package br.unitins.armas.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import br.unitins.armas.model.Cliente;
import br.unitins.armas.model.Pedido;

public record PedidoResponseDTO(
    Long id,
    LocalDateTime data,
    OpcaoDTO situacao,
    OpcaoDTO formaPagamento,
    Integer parcelas,
    BigDecimal valorTotal,
    ClienteResumoDTO cliente,
    List<ItemPedidoResponseDTO> itens
) {
    public record ClienteResumoDTO(Long id, String nome, String email, String telefone,
                                   String endereco) {
    }

    public static PedidoResponseDTO valueOf(Pedido pedido) {
        Cliente c = pedido.getCliente();
        String endereco = c.getLogradouro() + ", " + c.getNumero()
                + (c.getComplemento() == null ? "" : " - " + c.getComplemento())
                + " - " + c.getBairro() + ", " + c.getMunicipio().getNome()
                + "/" + c.getMunicipio().getEstado().getSigla();

        return new PedidoResponseDTO(
            pedido.getId(),
            pedido.getData(),
            new OpcaoDTO(pedido.getSituacao().name(), pedido.getSituacao().getNome()),
            new OpcaoDTO(pedido.getFormaPagamento().name(), pedido.getFormaPagamento().getNome()),
            pedido.getParcelas(),
            pedido.getValorTotal(),
            new ClienteResumoDTO(c.getId(), c.getNome(), c.getEmail(), c.getTelefone(), endereco),
            pedido.getItens().stream().map(ItemPedidoResponseDTO::valueOf).toList()
        );
    }
}

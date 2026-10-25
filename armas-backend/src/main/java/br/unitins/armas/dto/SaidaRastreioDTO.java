package br.unitins.armas.dto;

import java.time.LocalDateTime;

import br.unitins.armas.model.Cliente;
import br.unitins.armas.model.Pedido;
import br.unitins.armas.model.SaidaLote;

// uma venda que usou unidades do lote
public record SaidaRastreioDTO(
    Long idPedido,
    LocalDateTime dataPedido,
    OpcaoDTO situacaoPedido,
    Long idCliente,
    String nomeCliente,
    String cpfCliente,
    Integer quantidade
) {
    public static SaidaRastreioDTO valueOf(SaidaLote saida) {
        Pedido pedido = saida.getItemPedido().getPedido();
        Cliente cliente = pedido.getCliente();
        return new SaidaRastreioDTO(
            pedido.getId(),
            pedido.getData(),
            new OpcaoDTO(pedido.getSituacao().name(), pedido.getSituacao().getNome()),
            cliente.getId(),
            cliente.getNome(),
            mascararCpf(cliente.getCpf()),
            saida.getQuantidade()
        );
    }

    // mostra só parte do CPF: ***.456.789-**
    private static String mascararCpf(String cpf) {
        if (cpf == null || cpf.length() != 11)
            return cpf;
        return "***." + cpf.substring(3, 6) + "." + cpf.substring(6, 9) + "-**";
    }
}

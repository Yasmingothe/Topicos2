package br.unitins.armas.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

// registra: "X unidades do lote L foram para o item I do pedido P"
@Entity
@Table(name = "saida_lote")
public class SaidaLote extends EntidadeBase {

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_item_pedido", nullable = false)
    private ItemPedido itemPedido;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_lote", nullable = false)
    private Lote lote;

    @Column(nullable = false)
    private Integer quantidade;

    public ItemPedido getItemPedido() { return itemPedido; }
    public void setItemPedido(ItemPedido itemPedido) { this.itemPedido = itemPedido; }

    public Lote getLote() { return lote; }
    public void setLote(Lote lote) { this.lote = lote; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
}

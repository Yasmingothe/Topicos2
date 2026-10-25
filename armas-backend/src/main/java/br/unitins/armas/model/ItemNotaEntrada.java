package br.unitins.armas.model;

import java.math.BigDecimal;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

// cada linha da nota: qual produto, quantas unidades e quanto custou
@Entity
@Table(name = "item_nota_entrada")
public class ItemNotaEntrada extends EntidadeBase {

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_nota", nullable = false)
    private NotaEntrada nota;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_produto", nullable = false)
    private Produto produto;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal custoUnitario;

    // cada item da nota gera um lote
    @OneToOne(mappedBy = "itemNota", cascade = CascadeType.ALL, orphanRemoval = true)
    private Lote lote;

    public BigDecimal getSubtotal() {
        return custoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    public NotaEntrada getNota() { return nota; }
    public void setNota(NotaEntrada nota) { this.nota = nota; }

    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { this.produto = produto; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    public BigDecimal getCustoUnitario() { return custoUnitario; }
    public void setCustoUnitario(BigDecimal custoUnitario) { this.custoUnitario = custoUnitario; }

    public Lote getLote() { return lote; }
    public void setLote(Lote lote) { this.lote = lote; }
}

package br.unitins.armas.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

// lote = um grupo de unidades do mesmo produto que entrou pela mesma nota.
// serve para rastrear: de onde veio e para quem foi vendido
@Entity
public class Lote extends EntidadeBase {

    @Column(length = 30, nullable = false, unique = true)
    private String codigo;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_produto", nullable = false)
    private Produto produto;

    @OneToOne(optional = false)
    @JoinColumn(name = "id_item_nota", nullable = false, unique = true)
    private ItemNotaEntrada itemNota;

    @Column(nullable = false)
    private LocalDate dataEntrada;

    @Column(nullable = false)
    private Integer quantidadeInicial;

    // diminui a cada venda
    @Column(nullable = false)
    private Integer quantidadeDisponivel;

    public boolean foiMovimentado() {
        return !quantidadeDisponivel.equals(quantidadeInicial);
    }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { this.produto = produto; }

    public ItemNotaEntrada getItemNota() { return itemNota; }
    public void setItemNota(ItemNotaEntrada itemNota) { this.itemNota = itemNota; }

    public LocalDate getDataEntrada() { return dataEntrada; }
    public void setDataEntrada(LocalDate dataEntrada) { this.dataEntrada = dataEntrada; }

    public Integer getQuantidadeInicial() { return quantidadeInicial; }
    public void setQuantidadeInicial(Integer quantidadeInicial) { this.quantidadeInicial = quantidadeInicial; }

    public Integer getQuantidadeDisponivel() { return quantidadeDisponivel; }
    public void setQuantidadeDisponivel(Integer quantidadeDisponivel) { this.quantidadeDisponivel = quantidadeDisponivel; }
}

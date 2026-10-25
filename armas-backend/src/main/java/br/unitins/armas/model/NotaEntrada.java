package br.unitins.armas.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

// nota fiscal de ENTRADA: é por ela que o estoque aumenta
@Entity
@Table(name = "nota_entrada",
       uniqueConstraints = @UniqueConstraint(columnNames = { "numero", "serie", "id_fornecedor" }))
public class NotaEntrada extends EntidadeBase {

    @Column(length = 20, nullable = false)
    private String numero;

    @Column(length = 5, nullable = false)
    private String serie;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_fornecedor", nullable = false)
    private Fornecedor fornecedor;

    @Column(nullable = false)
    private LocalDate dataEmissao;

    @Column(nullable = false)
    private LocalDate dataEntrada;

    @Column(length = 500)
    private String observacao;

    // cascade ALL = salvar/excluir a nota também salva/exclui os itens dela
    @OneToMany(mappedBy = "nota", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemNotaEntrada> itens = new ArrayList<>();

    public BigDecimal getValorTotal() {
        return itens.stream()
                .map(ItemNotaEntrada::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public int getQuantidadeTotal() {
        return itens.stream().mapToInt(ItemNotaEntrada::getQuantidade).sum();
    }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getSerie() { return serie; }
    public void setSerie(String serie) { this.serie = serie; }

    public Fornecedor getFornecedor() { return fornecedor; }
    public void setFornecedor(Fornecedor fornecedor) { this.fornecedor = fornecedor; }

    public LocalDate getDataEmissao() { return dataEmissao; }
    public void setDataEmissao(LocalDate dataEmissao) { this.dataEmissao = dataEmissao; }

    public LocalDate getDataEntrada() { return dataEntrada; }
    public void setDataEntrada(LocalDate dataEntrada) { this.dataEntrada = dataEntrada; }

    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }

    public List<ItemNotaEntrada> getItens() { return itens; }
}

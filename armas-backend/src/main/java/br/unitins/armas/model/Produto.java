package br.unitins.armas.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Produto extends EntidadeBase {

    @Column(length = 120, nullable = false)
    private String nome;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_marca", nullable = false)
    private Marca marca;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private Categoria categoria;

    @Column(length = 30)
    private String calibre;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal preco;

    // o estoque NÃO é digitado: sobe pela nota de entrada e desce pela venda
    @Column(nullable = false)
    private Integer estoque = 0;

    @Column(length = 1000)
    private String descricao;

    @Column(nullable = false)
    private Boolean publicado = true;

    // nome do arquivo da foto salvo na pasta de imagens (pode ficar vazio)
    @Column(length = 120)
    private String nomeImagem;

    // ou um link de foto na internet (usado quando não tem arquivo enviado)
    @Column(length = 500)
    private String imagemUrl;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Marca getMarca() { return marca; }
    public void setMarca(Marca marca) { this.marca = marca; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }

    public String getCalibre() { return calibre; }
    public void setCalibre(String calibre) { this.calibre = calibre; }

    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }

    public Integer getEstoque() { return estoque; }
    public void setEstoque(Integer estoque) { this.estoque = estoque; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Boolean getPublicado() { return publicado; }
    public void setPublicado(Boolean publicado) { this.publicado = publicado; }

    public String getNomeImagem() { return nomeImagem; }
    public void setNomeImagem(String nomeImagem) { this.nomeImagem = nomeImagem; }

    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }
}
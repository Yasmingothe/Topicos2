package br.unitins.armas.dto;

import java.math.BigDecimal;

import br.unitins.armas.model.Produto;

public record ProdutoResponseDTO(
    Long id,
    String nome,
    MarcaResponseDTO marca,
    CategoriaDTO categoria,
    String calibre,
    BigDecimal preco,
    Integer estoque,
    String descricao,
    Boolean publicado,
    boolean temImagem,   // tem arquivo de foto enviado
    String imagemUrl     // ou um link de foto
) {
    public static ProdutoResponseDTO valueOf(Produto produto) {
        return new ProdutoResponseDTO(
            produto.getId(),
            produto.getNome(),
            MarcaResponseDTO.valueOf(produto.getMarca()),
            CategoriaDTO.valueOf(produto.getCategoria()),
            produto.getCalibre(),
            produto.getPreco(),
            produto.getEstoque(),
            produto.getDescricao(),
            produto.getPublicado(),
            produto.getNomeImagem() != null,
            produto.getImagemUrl()
        );
    }
}

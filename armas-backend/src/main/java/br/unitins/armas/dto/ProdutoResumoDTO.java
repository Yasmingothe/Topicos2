package br.unitins.armas.dto;

import br.unitins.armas.model.Produto;

// versão curta do produto, usada dentro de nota, lote e pedido
public record ProdutoResumoDTO(Long id, String nome, CategoriaDTO categoria, String calibre, boolean temImagem,
                               String imagemUrl) {

    public static ProdutoResumoDTO valueOf(Produto produto) {
        return new ProdutoResumoDTO(
            produto.getId(),
            produto.getNome(),
            CategoriaDTO.valueOf(produto.getCategoria()),
            produto.getCalibre(),
            produto.getNomeImagem() != null,
            produto.getImagemUrl()
        );
    }
}

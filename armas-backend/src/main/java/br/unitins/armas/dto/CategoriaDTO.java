package br.unitins.armas.dto;

import br.unitins.armas.model.Categoria;

public record CategoriaDTO(String codigo, String nome) {

    public static CategoriaDTO valueOf(Categoria categoria) {
        return new CategoriaDTO(categoria.name(), categoria.getNome());
    }
}
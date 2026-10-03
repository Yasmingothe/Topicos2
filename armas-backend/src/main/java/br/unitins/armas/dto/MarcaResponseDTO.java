package br.unitins.armas.dto;

import br.unitins.armas.model.Marca;

public record MarcaResponseDTO(
    Long id,
    String nome,
    String paisOrigem,
    Boolean ativa
) {
    public static MarcaResponseDTO valueOf(Marca marca) {
        return new MarcaResponseDTO(
            marca.getId(),
            marca.getNome(),
            marca.getPaisOrigem(),
            marca.getAtiva()
        );
    }
}
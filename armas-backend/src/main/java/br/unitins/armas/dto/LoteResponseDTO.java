package br.unitins.armas.dto;

import java.time.LocalDate;

import br.unitins.armas.model.Lote;
import br.unitins.armas.model.NotaEntrada;

public record LoteResponseDTO(
    Long id,
    String codigo,
    ProdutoResumoDTO produto,
    LocalDate dataEntrada,
    Integer quantidadeInicial,
    Integer quantidadeDisponivel,
    Long idNota,
    String numeroNota,
    String serieNota,
    String fornecedor
) {
    public static LoteResponseDTO valueOf(Lote lote) {
        NotaEntrada nota = lote.getItemNota().getNota();
        return new LoteResponseDTO(
            lote.getId(),
            lote.getCodigo(),
            ProdutoResumoDTO.valueOf(lote.getProduto()),
            lote.getDataEntrada(),
            lote.getQuantidadeInicial(),
            lote.getQuantidadeDisponivel(),
            nota.getId(),
            nota.getNumero(),
            nota.getSerie(),
            nota.getFornecedor().getRazaoSocial()
        );
    }
}

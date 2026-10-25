package br.unitins.armas.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import br.unitins.armas.model.NotaEntrada;

public record NotaEntradaResponseDTO(
    Long id,
    String numero,
    String serie,
    FornecedorResponseDTO fornecedor,
    LocalDate dataEmissao,
    LocalDate dataEntrada,
    String observacao,
    BigDecimal valorTotal,
    int quantidadeTotal,
    // só pode excluir se nenhuma unidade da nota foi vendida
    boolean podeExcluir,
    List<ItemNotaEntradaResponseDTO> itens
) {
    public static NotaEntradaResponseDTO valueOf(NotaEntrada nota) {
        boolean nenhumLoteVendido = nota.getItens().stream()
                .noneMatch(item -> item.getLote().foiMovimentado());

        return new NotaEntradaResponseDTO(
            nota.getId(),
            nota.getNumero(),
            nota.getSerie(),
            FornecedorResponseDTO.valueOf(nota.getFornecedor()),
            nota.getDataEmissao(),
            nota.getDataEntrada(),
            nota.getObservacao(),
            nota.getValorTotal(),
            nota.getQuantidadeTotal(),
            nenhumLoteVendido,
            nota.getItens().stream().map(ItemNotaEntradaResponseDTO::valueOf).toList()
        );
    }
}

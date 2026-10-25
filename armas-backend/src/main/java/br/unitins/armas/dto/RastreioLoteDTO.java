package br.unitins.armas.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

// a "história" do lote: de qual nota veio e para quem foi vendido
public record RastreioLoteDTO(
    LoteResponseDTO lote,
    LocalDate dataEmissaoNota,
    BigDecimal custoUnitario,
    int quantidadeVendida,
    List<SaidaRastreioDTO> saidas
) {
}

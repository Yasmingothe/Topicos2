package br.unitins.armas.dto;

import java.math.BigDecimal;

public record ResumoDashboardDTO(
    long totalPedidos,
    BigDecimal faturamento,
    long pedidosEmAberto,
    long autorizacoesEmAnalise,
    long notasEntrada,
    long lotesComSaldo
) {
}

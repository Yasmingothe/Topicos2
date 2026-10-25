package br.unitins.armas.service;

import java.math.BigDecimal;
import java.util.List;

import br.unitins.armas.dto.ResumoDashboardDTO;
import br.unitins.armas.model.Pedido;
import br.unitins.armas.model.SituacaoAutorizacao;
import br.unitins.armas.model.SituacaoPedido;
import br.unitins.armas.repository.ClienteRepository;
import br.unitins.armas.repository.LoteRepository;
import br.unitins.armas.repository.NotaEntradaRepository;
import br.unitins.armas.repository.PedidoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

// números do topo do dashboard
@ApplicationScoped
public class DashboardService {

    @Inject
    PedidoRepository pedidoRepository;

    @Inject
    ClienteRepository clienteRepository;

    @Inject
    NotaEntradaRepository notaRepository;

    @Inject
    LoteRepository loteRepository;

    public ResumoDashboardDTO resumo() {
        List<Pedido> validos = pedidoRepository.list("situacao <> ?1", SituacaoPedido.CANCELADO);

        BigDecimal faturamento = validos.stream()
                .map(Pedido::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long emAberto = validos.stream()
                .filter(p -> p.getSituacao() != SituacaoPedido.ENTREGUE)
                .count();

        return new ResumoDashboardDTO(
            validos.size(),
            faturamento,
            emAberto,
            clienteRepository.count("situacaoAutorizacao", SituacaoAutorizacao.EM_ANALISE),
            notaRepository.count(),
            loteRepository.count("quantidadeDisponivel > 0")
        );
    }
}

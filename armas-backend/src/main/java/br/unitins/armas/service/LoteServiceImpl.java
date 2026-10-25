package br.unitins.armas.service;

import java.util.List;

import br.unitins.armas.dto.LoteResponseDTO;
import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.dto.RastreioLoteDTO;
import br.unitins.armas.dto.SaidaRastreioDTO;
import br.unitins.armas.model.Lote;
import br.unitins.armas.repository.LoteRepository;
import br.unitins.armas.repository.SaidaLoteRepository;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class LoteServiceImpl implements LoteService {

    @Inject
    LoteRepository repository;

    @Inject
    SaidaLoteRepository saidaRepository;

    @Override
    @Transactional
    public PaginaDTO<LoteResponseDTO> findAll(String codigo, Long idProduto, Boolean somenteComSaldo,
                                              int page, int pageSize) {
        PanacheQuery<Lote> consulta = repository.buscar(codigo, idProduto, somenteComSaldo);
        List<LoteResponseDTO> itens = consulta.page(page, pageSize)
                .list()
                .stream()
                .map(LoteResponseDTO::valueOf)
                .toList();
        return PaginaDTO.of(itens, page, pageSize, consulta.count());
    }

    @Override
    @Transactional
    public RastreioLoteDTO rastrear(Long id) {
        Lote lote = repository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Lote não encontrado."));

        List<SaidaRastreioDTO> saidas = saidaRepository.doLote(id)
                .stream()
                .map(SaidaRastreioDTO::valueOf)
                .toList();

        int vendida = saidas.stream()
                .filter(s -> !s.situacaoPedido().codigo().equals("CANCELADO"))
                .mapToInt(SaidaRastreioDTO::quantidade)
                .sum();

        return new RastreioLoteDTO(
            LoteResponseDTO.valueOf(lote),
            lote.getItemNota().getNota().getDataEmissao(),
            lote.getItemNota().getCustoUnitario(),
            vendida,
            saidas
        );
    }
}

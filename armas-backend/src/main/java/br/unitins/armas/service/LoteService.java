package br.unitins.armas.service;

import br.unitins.armas.dto.LoteResponseDTO;
import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.dto.RastreioLoteDTO;

public interface LoteService {

    PaginaDTO<LoteResponseDTO> findAll(String codigo, Long idProduto, Boolean somenteComSaldo, int page, int pageSize);

    RastreioLoteDTO rastrear(Long id);
}

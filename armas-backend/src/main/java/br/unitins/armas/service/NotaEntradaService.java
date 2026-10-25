package br.unitins.armas.service;

import br.unitins.armas.dto.NotaEntradaRequestDTO;
import br.unitins.armas.dto.NotaEntradaResponseDTO;
import br.unitins.armas.dto.PaginaDTO;

public interface NotaEntradaService {

    NotaEntradaResponseDTO create(NotaEntradaRequestDTO dto);

    void delete(Long id);

    NotaEntradaResponseDTO findById(Long id);

    PaginaDTO<NotaEntradaResponseDTO> findAll(String numero, Long idFornecedor, int page, int pageSize);
}

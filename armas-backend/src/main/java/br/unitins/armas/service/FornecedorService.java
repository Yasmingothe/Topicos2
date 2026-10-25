package br.unitins.armas.service;

import br.unitins.armas.dto.FornecedorRequestDTO;
import br.unitins.armas.dto.FornecedorResponseDTO;
import br.unitins.armas.dto.PaginaDTO;

public interface FornecedorService {

    FornecedorResponseDTO create(FornecedorRequestDTO dto);

    void update(Long id, FornecedorRequestDTO dto);

    void delete(Long id);

    FornecedorResponseDTO findById(Long id);

    PaginaDTO<FornecedorResponseDTO> findAll(String busca, int page, int pageSize);
}

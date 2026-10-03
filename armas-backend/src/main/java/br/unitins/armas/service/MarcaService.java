package br.unitins.armas.service;

import br.unitins.armas.dto.MarcaRequestDTO;
import br.unitins.armas.dto.MarcaResponseDTO;
import br.unitins.armas.dto.PaginaDTO;

public interface MarcaService {

    MarcaResponseDTO create(MarcaRequestDTO dto);

    void update(Long id, MarcaRequestDTO dto);

    void delete(Long id);

    MarcaResponseDTO findById(Long id);

    PaginaDTO<MarcaResponseDTO> findAll(String nome, int page, int pageSize);
}
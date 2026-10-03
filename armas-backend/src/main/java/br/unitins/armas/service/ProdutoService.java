package br.unitins.armas.service;

import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.dto.ProdutoRequestDTO;
import br.unitins.armas.dto.ProdutoResponseDTO;

public interface ProdutoService {

    ProdutoResponseDTO create(ProdutoRequestDTO dto);

    void update(Long id, ProdutoRequestDTO dto);

    void delete(Long id);

    ProdutoResponseDTO findById(Long id);

    PaginaDTO<ProdutoResponseDTO> findAll(String nome, Long idMarca, String categoria,
                                          int page, int pageSize);
}
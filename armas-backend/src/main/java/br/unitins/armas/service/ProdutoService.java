package br.unitins.armas.service;

import java.nio.file.Path;

import org.jboss.resteasy.reactive.multipart.FileUpload;

import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.dto.ProdutoRequestDTO;
import br.unitins.armas.dto.ProdutoResponseDTO;

public interface ProdutoService {

    ProdutoResponseDTO create(ProdutoRequestDTO dto);

    void update(Long id, ProdutoRequestDTO dto);

    void delete(Long id);

    ProdutoResponseDTO findById(Long id);

    PaginaDTO<ProdutoResponseDTO> findAll(String nome, Long idMarca, String categoria, Boolean publicado,
                                          int page, int pageSize);

    // ===== foto do produto =====
    void salvarImagem(Long id, FileUpload arquivo);

    void removerImagem(Long id);

    Path caminhoImagem(Long id);
}

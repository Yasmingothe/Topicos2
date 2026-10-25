package br.unitins.armas.service;

import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.dto.UsuarioRequestDTO;
import br.unitins.armas.dto.UsuarioResponseDTO;

public interface UsuarioService {

    UsuarioResponseDTO create(UsuarioRequestDTO dto);

    void alterarAtivo(Long id, boolean ativo, Long idUsuarioLogado);

    PaginaDTO<UsuarioResponseDTO> findAll(String nome, String perfil, int page, int pageSize);
}

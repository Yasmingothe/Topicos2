package br.unitins.armas.service;

import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.dto.UsuarioResponseDTO;

public interface UsuarioService {

    void alterarAtivo(Long id, boolean ativo, Long idUsuarioLogado);

    PaginaDTO<UsuarioResponseDTO> findAll(String nome, String perfil, int page, int pageSize);
}

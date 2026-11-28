package br.unitins.armas.service;

import br.unitins.armas.dto.UsuarioResponseDTO;

public interface AuthService {

    UsuarioResponseDTO buscarUsuario(Long idUsuario);
}

package br.unitins.armas.service;

import br.unitins.armas.dto.CadastroContaDTO;
import br.unitins.armas.dto.LoginDTO;
import br.unitins.armas.dto.TokenResponseDTO;
import br.unitins.armas.dto.UsuarioResponseDTO;

public interface AuthService {

    TokenResponseDTO login(LoginDTO dto);

    TokenResponseDTO cadastrar(CadastroContaDTO dto);

    UsuarioResponseDTO buscarUsuario(Long idUsuario);
}

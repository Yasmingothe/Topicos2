package br.unitins.armas.service;

import br.unitins.armas.dto.AlterarSenhaDTO;
import br.unitins.armas.dto.CadastroContaDTO;
import br.unitins.armas.dto.LoginDTO;
import br.unitins.armas.dto.TokenResponseDTO;
import br.unitins.armas.model.Usuario;

public interface AuthService {

    TokenResponseDTO login(LoginDTO dto);

    TokenResponseDTO cadastrar(CadastroContaDTO dto);

    TokenResponseDTO renovar(String refreshToken);

    void sair(String refreshToken);

    void alterarSenha(Usuario usuario, AlterarSenhaDTO dto);

    // liga o usuário do Keycloak ao usuário do nosso banco (cria se ainda não existir)
    Usuario sincronizar(String keycloakId, String email, String nome, boolean admin);
}

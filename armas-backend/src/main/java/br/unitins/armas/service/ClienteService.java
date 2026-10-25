package br.unitins.armas.service;

import br.unitins.armas.dto.AutorizacaoRequestDTO;
import br.unitins.armas.dto.ClienteRequestDTO;
import br.unitins.armas.dto.ClienteResponseDTO;
import br.unitins.armas.dto.PaginaDTO;

public interface ClienteService {

    ClienteResponseDTO create(ClienteRequestDTO dto);

    void update(Long id, ClienteRequestDTO dto);

    void delete(Long id);

    ClienteResponseDTO findById(Long id);

    PaginaDTO<ClienteResponseDTO> findAll(String nome, String situacaoAutorizacao, int page, int pageSize);

    // ===== admin: aprovar ou recusar a autorização de compra =====
    void avaliarAutorizacao(Long idCliente, String situacao);

    // ===== "Minha conta" (cliente logado) =====
    ClienteResponseDTO buscarDoUsuario(Long idUsuario);

    ClienteResponseDTO salvarDoUsuario(Long idUsuario, ClienteRequestDTO dto);

    ClienteResponseDTO enviarAutorizacao(Long idUsuario, AutorizacaoRequestDTO dto);
}

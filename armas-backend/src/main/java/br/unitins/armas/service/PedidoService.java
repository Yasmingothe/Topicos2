package br.unitins.armas.service;

import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.dto.PedidoRequestDTO;
import br.unitins.armas.dto.PedidoResponseDTO;

public interface PedidoService {

    // loja (cliente logado)
    PedidoResponseDTO criar(Long idUsuario, PedidoRequestDTO dto);

    PaginaDTO<PedidoResponseDTO> meusPedidos(Long idUsuario, int page, int pageSize);

    PedidoResponseDTO meuPedido(Long idUsuario, Long idPedido);

    void cancelarMeuPedido(Long idUsuario, Long idPedido);

    // painel (admin)
    PaginaDTO<PedidoResponseDTO> findAll(String nomeCliente, String situacao, int page, int pageSize);

    PedidoResponseDTO findById(Long id);

    void alterarSituacao(Long id, String situacao);
}

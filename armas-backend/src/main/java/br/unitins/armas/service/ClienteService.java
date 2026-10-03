package br.unitins.armas.service;

import br.unitins.armas.dto.ClienteRequestDTO;
import br.unitins.armas.dto.ClienteResponseDTO;
import br.unitins.armas.dto.PaginaDTO;

public interface ClienteService {

    ClienteResponseDTO create(ClienteRequestDTO dto);

    void update(Long id, ClienteRequestDTO dto);

    void delete(Long id);

    ClienteResponseDTO findById(Long id);

    PaginaDTO<ClienteResponseDTO> findAll(String nome, int page, int pageSize);
}
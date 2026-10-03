package br.unitins.armas.dto;

import java.time.LocalDate;

import br.unitins.armas.model.Cliente;

public record ClienteResponseDTO(
    Long id,
    String nome,
    String email,
    String cpf,
    LocalDate dataNascimento,
    String telefone,
    String cep,
    String logradouro,
    String numero,
    String complemento,
    String bairro,
    MunicipioResponseDTO municipio 
) {
    public static ClienteResponseDTO valueOf(Cliente cliente) {
        return new ClienteResponseDTO(
            cliente.getId(),
            cliente.getNome(),
            cliente.getEmail(),
            cliente.getCpf(),
            cliente.getDataNascimento(),
            cliente.getTelefone(),
            cliente.getCep(),
            cliente.getLogradouro(),
            cliente.getNumero(),
            cliente.getComplemento(),
            cliente.getBairro(),
            MunicipioResponseDTO.valueOf(cliente.getMunicipio())
        );
    }
}
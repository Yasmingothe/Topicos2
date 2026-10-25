package br.unitins.armas.dto;

import java.time.LocalDate;
import java.time.Period;

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
    MunicipioResponseDTO municipio,
    int idade,
    boolean temConta,
    String numeroAutorizacao,
    LocalDate validadeAutorizacao,
    OpcaoDTO situacaoAutorizacao,
    boolean autorizacaoValida
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
            MunicipioResponseDTO.valueOf(cliente.getMunicipio()),
            Period.between(cliente.getDataNascimento(), LocalDate.now()).getYears(),
            cliente.getUsuario() != null,
            cliente.getNumeroAutorizacao(),
            cliente.getValidadeAutorizacao(),
            new OpcaoDTO(cliente.getSituacaoAutorizacao().name(), cliente.getSituacaoAutorizacao().getNome()),
            cliente.autorizacaoValida()
        );
    }
}
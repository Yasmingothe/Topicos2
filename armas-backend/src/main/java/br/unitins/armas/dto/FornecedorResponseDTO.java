package br.unitins.armas.dto;

import br.unitins.armas.model.Fornecedor;

public record FornecedorResponseDTO(
    Long id,
    String razaoSocial,
    String nomeFantasia,
    String cnpj,
    String email,
    String telefone,
    Boolean ativo
) {
    public static FornecedorResponseDTO valueOf(Fornecedor fornecedor) {
        return new FornecedorResponseDTO(
            fornecedor.getId(),
            fornecedor.getRazaoSocial(),
            fornecedor.getNomeFantasia(),
            fornecedor.getCnpj(),
            fornecedor.getEmail(),
            fornecedor.getTelefone(),
            fornecedor.getAtivo()
        );
    }
}

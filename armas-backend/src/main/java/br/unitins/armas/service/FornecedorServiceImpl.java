package br.unitins.armas.service;

import java.util.List;

import br.unitins.armas.dto.FornecedorRequestDTO;
import br.unitins.armas.dto.FornecedorResponseDTO;
import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.exception.CampoInvalidoException;
import br.unitins.armas.model.Fornecedor;
import br.unitins.armas.repository.FornecedorRepository;
import br.unitins.armas.repository.NotaEntradaRepository;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class FornecedorServiceImpl implements FornecedorService {

    @Inject
    FornecedorRepository repository;

    @Inject
    NotaEntradaRepository notaRepository;

    @Override
    @Transactional
    public FornecedorResponseDTO create(FornecedorRequestDTO dto) {
        validarRegras(dto, null);

        Fornecedor fornecedor = new Fornecedor();
        preencher(fornecedor, dto);
        repository.persist(fornecedor);
        return FornecedorResponseDTO.valueOf(fornecedor);
    }

    @Override
    @Transactional
    public void update(Long id, FornecedorRequestDTO dto) {
        validarRegras(dto, id);
        preencher(buscarOuFalhar(id), dto);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (notaRepository.existeComFornecedor(id))
            throw new CampoInvalidoException("fornecedor",
                    "Este fornecedor tem notas fiscais lançadas e não pode ser excluído. Você pode desativá-lo.");

        if (!repository.deleteById(id))
            throw new NotFoundException("Fornecedor não encontrado.");
    }

    @Override
    public FornecedorResponseDTO findById(Long id) {
        return FornecedorResponseDTO.valueOf(buscarOuFalhar(id));
    }

    @Override
    public PaginaDTO<FornecedorResponseDTO> findAll(String busca, int page, int pageSize) {
        PanacheQuery<Fornecedor> consulta = repository.buscar(busca);
        List<FornecedorResponseDTO> itens = consulta.page(page, pageSize)
                .list()
                .stream()
                .map(FornecedorResponseDTO::valueOf)
                .toList();
        return PaginaDTO.of(itens, page, pageSize, consulta.count());
    }

    private void validarRegras(FornecedorRequestDTO dto, Long idIgnorado) {
        if (!cnpjValido(dto.cnpj()))
            throw new CampoInvalidoException("cnpj", "CNPJ inválido.");

        if (repository.existeCnpj(dto.cnpj(), idIgnorado))
            throw new CampoInvalidoException("cnpj", "Já existe um fornecedor com esse CNPJ.");
    }

    // confere os 2 dígitos verificadores do CNPJ (mesma ideia do CPF, com outros pesos)
    private boolean cnpjValido(String cnpj) {
        if (cnpj == null || !cnpj.matches("\\d{14}") || cnpj.chars().distinct().count() == 1)
            return false;

        int[] pesos1 = { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
        int[] pesos2 = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };

        return digito(cnpj, pesos1) == cnpj.charAt(12) - '0'
            && digito(cnpj, pesos2) == cnpj.charAt(13) - '0';
    }

    private int digito(String cnpj, int[] pesos) {
        int soma = 0;
        for (int i = 0; i < pesos.length; i++)
            soma += (cnpj.charAt(i) - '0') * pesos[i];
        int resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }

    private void preencher(Fornecedor fornecedor, FornecedorRequestDTO dto) {
        fornecedor.setRazaoSocial(dto.razaoSocial().trim());
        fornecedor.setNomeFantasia(textoOuNulo(dto.nomeFantasia()));
        fornecedor.setCnpj(dto.cnpj());
        fornecedor.setEmail(dto.email() == null || dto.email().isBlank() ? null : dto.email().trim().toLowerCase());
        fornecedor.setTelefone(textoOuNulo(dto.telefone()));
        fornecedor.setAtivo(dto.ativo() == null ? true : dto.ativo());
    }

    private String textoOuNulo(String texto) {
        return (texto == null || texto.isBlank()) ? null : texto.trim();
    }

    private Fornecedor buscarOuFalhar(Long id) {
        return repository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Fornecedor não encontrado."));
    }
}

package br.unitins.armas.service;

import java.util.List;

import br.unitins.armas.dto.MarcaRequestDTO;
import br.unitins.armas.dto.MarcaResponseDTO;
import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.exception.CampoInvalidoException;
import br.unitins.armas.model.Marca;
import br.unitins.armas.repository.MarcaRepository;
import br.unitins.armas.repository.ProdutoRepository;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class MarcaServiceImpl implements MarcaService {

    @Inject
    MarcaRepository repository;

    @Inject
    ProdutoRepository produtoRepository;

    @Override
    @Transactional
    public MarcaResponseDTO create(MarcaRequestDTO dto) {
        verificarNomeRepetido(dto.nome(), null);

        Marca marca = new Marca();
        preencher(marca, dto);
        repository.persist(marca);

        return MarcaResponseDTO.valueOf(marca);
    }

    @Override
    @Transactional
    public void update(Long id, MarcaRequestDTO dto) {
        verificarNomeRepetido(dto.nome(), id);

        Marca marca = buscarOuFalhar(id);
        preencher(marca, dto);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (produtoRepository.existeComMarca(id))
            throw new CampoInvalidoException("marca",
                    "Esta marca possui produtos cadastrados e não pode ser excluída.");

        if (!repository.deleteById(id))
            throw new NotFoundException("Marca não encontrada.");
    }

    @Override
    public MarcaResponseDTO findById(Long id) {
        return MarcaResponseDTO.valueOf(buscarOuFalhar(id));
    }

    @Override
    public PaginaDTO<MarcaResponseDTO> findAll(String nome, int page, int pageSize) {
        PanacheQuery<Marca> consulta = (nome == null || nome.isBlank())
                ? repository.findAllOrdenado()
                : repository.findByNome(nome.trim());

        List<MarcaResponseDTO> itens = consulta.page(page, pageSize)
                .list()
                .stream()
                .map(MarcaResponseDTO::valueOf)
                .toList();

        return PaginaDTO.of(itens, page, pageSize, consulta.count());
    }

    private void preencher(Marca marca, MarcaRequestDTO dto) {
        marca.setNome(dto.nome().trim());
        marca.setPaisOrigem(dto.paisOrigem().trim());
        marca.setAtiva(dto.ativa() == null ? true : dto.ativa());
    }

    private void verificarNomeRepetido(String nome, Long idIgnorado) {
        if (repository.existeNome(nome.trim(), idIgnorado))
            throw new CampoInvalidoException("nome", "Já existe uma marca com esse nome.");
    }

    private Marca buscarOuFalhar(Long id) {
        return repository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Marca não encontrada."));
    }
}
package br.unitins.armas.service;

import java.util.List;

import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.dto.ProdutoRequestDTO;
import br.unitins.armas.dto.ProdutoResponseDTO;
import br.unitins.armas.exception.CampoInvalidoException;
import br.unitins.armas.model.Categoria;
import br.unitins.armas.model.Marca;
import br.unitins.armas.model.Produto;
import br.unitins.armas.repository.MarcaRepository;
import br.unitins.armas.repository.ProdutoRepository;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class ProdutoServiceImpl implements ProdutoService {

    @Inject
    ProdutoRepository repository;

    @Inject
    MarcaRepository marcaRepository;

    @Override
    @Transactional
    public ProdutoResponseDTO create(ProdutoRequestDTO dto) {
        Produto produto = new Produto();
        preencher(produto, dto);
        repository.persist(produto);
        return ProdutoResponseDTO.valueOf(produto);
    }

    @Override
    @Transactional
    public void update(Long id, ProdutoRequestDTO dto) {
        preencher(buscarOuFalhar(id), dto);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!repository.deleteById(id))
            throw new NotFoundException("Produto não encontrado.");
    }

    @Override
    public ProdutoResponseDTO findById(Long id) {
        return ProdutoResponseDTO.valueOf(buscarOuFalhar(id));
    }

    @Override
    public PaginaDTO<ProdutoResponseDTO> findAll(String nome, Long idMarca, String categoria,
                                                 int page, int pageSize) {
        Categoria filtroCategoria = (categoria == null || categoria.isBlank())
                ? null
                : converterCategoria(categoria);

        PanacheQuery<Produto> consulta = repository.buscar(nome, idMarca, filtroCategoria);

        List<ProdutoResponseDTO> itens = consulta.page(page, pageSize)
                .list()
                .stream()
                .map(ProdutoResponseDTO::valueOf)
                .toList();

        return PaginaDTO.of(itens, page, pageSize, consulta.count());
    }

    private void preencher(Produto produto, ProdutoRequestDTO dto) {
        Marca marca = buscarMarca(dto.idMarca());

        boolean trocouDeMarca = produto.getMarca() == null
                || !produto.getMarca().getId().equals(marca.getId());
        if (trocouDeMarca && !marca.getAtiva())
            throw new CampoInvalidoException("idMarca", "Esta marca está inativa.");

        produto.setNome(dto.nome().trim());
        produto.setMarca(marca);
        produto.setCategoria(converterCategoria(dto.categoria()));
        produto.setCalibre(textoOuNulo(dto.calibre()));
        produto.setPreco(dto.preco());
        produto.setEstoque(dto.estoque());
        produto.setDescricao(textoOuNulo(dto.descricao()));
        produto.setPublicado(dto.publicado() == null ? true : dto.publicado());
    }

    private Marca buscarMarca(Long idMarca) {
        Marca marca = marcaRepository.findById(idMarca);
        if (marca == null)
            throw new CampoInvalidoException("idMarca", "Marca não encontrada.");
        return marca;
    }

    private Categoria converterCategoria(String codigo) {
        Categoria categoria = Categoria.buscarPorCodigo(codigo);
        if (categoria == null)
            throw new CampoInvalidoException("categoria", "Categoria inválida.");
        return categoria;
    }

    private String textoOuNulo(String texto) {
        return (texto == null || texto.isBlank()) ? null : texto.trim();
    }

    private Produto buscarOuFalhar(Long id) {
        return repository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado."));
    }
}
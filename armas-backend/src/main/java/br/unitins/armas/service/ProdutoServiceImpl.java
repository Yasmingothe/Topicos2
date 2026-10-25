package br.unitins.armas.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.dto.ProdutoRequestDTO;
import br.unitins.armas.dto.ProdutoResponseDTO;
import br.unitins.armas.exception.CampoInvalidoException;
import br.unitins.armas.exception.RegraNegocioException;
import br.unitins.armas.model.Categoria;
import br.unitins.armas.model.Marca;
import br.unitins.armas.model.Produto;
import br.unitins.armas.repository.LoteRepository;
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

    @Inject
    LoteRepository loteRepository;

    // pasta onde as fotos ficam salvas (configurada no application.properties)
    @ConfigProperty(name = "armas.imagens.pasta")
    String pastaImagens;

    private static final long TAMANHO_MAXIMO = 5 * 1024 * 1024; // 5 MB

    private static final Map<String, String> EXTENSOES = Map.of(
            "image/jpeg", "jpg",
            "image/png", "png",
            "image/webp", "webp");

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
        if (loteRepository.existeComProduto(id))
            throw new CampoInvalidoException("produto",
                    "Este produto já tem notas de entrada e lotes. Para tirar da loja, deixe como rascunho.");

        Produto produto = buscarOuFalhar(id);
        apagarArquivo(produto.getNomeImagem());
        repository.delete(produto);
    }

    @Override
    public ProdutoResponseDTO findById(Long id) {
        return ProdutoResponseDTO.valueOf(buscarOuFalhar(id));
    }

    @Override
    public PaginaDTO<ProdutoResponseDTO> findAll(String nome, Long idMarca, String categoria, Boolean publicado,
                                                 int page, int pageSize) {
        Categoria filtroCategoria = (categoria == null || categoria.isBlank())
                ? null
                : converterCategoria(categoria);

        PanacheQuery<Produto> consulta = repository.buscar(nome, idMarca, filtroCategoria, publicado);

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
        produto.setDescricao(textoOuNulo(dto.descricao()));
        produto.setPublicado(dto.publicado() == null ? true : dto.publicado());
        produto.setImagemUrl(textoOuNulo(dto.imagemUrl()));
    }

    // ===== FOTO =====

    @Override
    @Transactional
    public void salvarImagem(Long id, FileUpload arquivo) {
        Produto produto = buscarOuFalhar(id);

        if (arquivo == null || arquivo.uploadedFile() == null)
            throw new RegraNegocioException("Selecione uma imagem.");

        String extensao = EXTENSOES.get(arquivo.contentType());
        if (extensao == null)
            throw new RegraNegocioException("Envie uma imagem JPG, PNG ou WEBP.");

        if (arquivo.size() > TAMANHO_MAXIMO)
            throw new RegraNegocioException("A imagem deve ter no máximo 5 MB.");

        // nome fixo pelo id (produto-1.jpg): assim a foto volta sozinha mesmo depois
        // do drop-and-create recriar o banco (ver FotoProdutoService)
        String nomeArquivo = "produto-" + id + "." + extensao;

        apagarArquivo(produto.getNomeImagem());
        try {
            Path pasta = Path.of(pastaImagens);
            Files.createDirectories(pasta);
            Files.copy(arquivo.uploadedFile(), pasta.resolve(nomeArquivo), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RegraNegocioException("Não foi possível salvar a imagem.");
        }

        produto.setNomeImagem(nomeArquivo);
    }

    @Override
    @Transactional
    public void removerImagem(Long id) {
        Produto produto = buscarOuFalhar(id);
        apagarArquivo(produto.getNomeImagem());
        produto.setNomeImagem(null);
    }

    @Override
    public Path caminhoImagem(Long id) {
        Produto produto = buscarOuFalhar(id);
        if (produto.getNomeImagem() == null)
            throw new NotFoundException("Este produto não tem foto.");

        Path caminho = Path.of(pastaImagens).resolve(produto.getNomeImagem());
        if (!Files.exists(caminho))
            throw new NotFoundException("O arquivo da foto não foi encontrado.");
        return caminho;
    }

    private void apagarArquivo(String nomeArquivo) {
        if (nomeArquivo == null)
            return;
        try {
            Files.deleteIfExists(Path.of(pastaImagens).resolve(nomeArquivo));
        } catch (IOException e) {
            // se não conseguir apagar a foto antiga, segue: não atrapalha o cadastro
        }
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
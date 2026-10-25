package br.unitins.armas.service;

import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import br.unitins.armas.dto.ItemNotaEntradaRequestDTO;
import br.unitins.armas.dto.NotaEntradaRequestDTO;
import br.unitins.armas.dto.NotaEntradaResponseDTO;
import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.exception.CampoInvalidoException;
import br.unitins.armas.exception.RegraNegocioException;
import br.unitins.armas.model.Fornecedor;
import br.unitins.armas.model.ItemNotaEntrada;
import br.unitins.armas.model.Lote;
import br.unitins.armas.model.NotaEntrada;
import br.unitins.armas.model.Produto;
import br.unitins.armas.repository.FornecedorRepository;
import br.unitins.armas.repository.LoteRepository;
import br.unitins.armas.repository.NotaEntradaRepository;
import br.unitins.armas.repository.ProdutoRepository;
import br.unitins.armas.repository.SaidaLoteRepository;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

// ENTRADA DE ESTOQUE: cada item da nota vira um lote e soma no estoque do produto
@ApplicationScoped
public class NotaEntradaServiceImpl implements NotaEntradaService {

    private static final DateTimeFormatter FORMATO_LOTE = DateTimeFormatter.ofPattern("yyMMdd");

    @Inject
    NotaEntradaRepository repository;

    @Inject
    FornecedorRepository fornecedorRepository;

    @Inject
    ProdutoRepository produtoRepository;

    @Inject
    LoteRepository loteRepository;

    @Inject
    SaidaLoteRepository saidaRepository;

    @Override
    @Transactional
    public NotaEntradaResponseDTO create(NotaEntradaRequestDTO dto) {
        Fornecedor fornecedor = fornecedorRepository.findById(dto.idFornecedor());
        if (fornecedor == null)
            throw new CampoInvalidoException("idFornecedor", "Fornecedor não encontrado.");
        if (!fornecedor.getAtivo())
            throw new CampoInvalidoException("idFornecedor", "Este fornecedor está inativo.");

        String serie = dto.serie().trim().toUpperCase();
        if (repository.existeNota(dto.numero(), serie, fornecedor.getId()))
            throw new CampoInvalidoException("numero",
                    "A nota " + dto.numero() + " série " + serie + " deste fornecedor já foi lançada.");

        if (dto.dataEntrada().isBefore(dto.dataEmissao()))
            throw new CampoInvalidoException("dataEntrada", "A data de entrada não pode ser antes da emissão.");

        NotaEntrada nota = new NotaEntrada();
        nota.setNumero(dto.numero());
        nota.setSerie(serie);
        nota.setFornecedor(fornecedor);
        nota.setDataEmissao(dto.dataEmissao());
        nota.setDataEntrada(dto.dataEntrada());
        nota.setObservacao(dto.observacao() == null || dto.observacao().isBlank() ? null : dto.observacao().trim());

        // guarda os códigos de lote desta nota para não repetir dentro dela mesma
        Set<String> codigosDaNota = new HashSet<>();

        for (ItemNotaEntradaRequestDTO itemDto : dto.itens()) {
            Produto produto = produtoRepository.findById(itemDto.idProduto());
            if (produto == null)
                throw new RegraNegocioException("Produto " + itemDto.idProduto() + " não encontrado.");

            ItemNotaEntrada item = new ItemNotaEntrada();
            item.setNota(nota);
            item.setProduto(produto);
            item.setQuantidade(itemDto.quantidade());
            item.setCustoUnitario(itemDto.custoUnitario());

            Lote lote = new Lote();
            lote.setCodigo(definirCodigoLote(itemDto.codigoLote(), nota, produto, codigosDaNota));
            lote.setProduto(produto);
            lote.setItemNota(item);
            lote.setDataEntrada(dto.dataEntrada());
            lote.setQuantidadeInicial(itemDto.quantidade());
            lote.setQuantidadeDisponivel(itemDto.quantidade());
            item.setLote(lote);

            nota.getItens().add(item);

            // aqui o estoque SOBE
            produto.setEstoque(produto.getEstoque() + itemDto.quantidade());
        }

        repository.persist(nota); // cascade: salva os itens e os lotes junto
        return NotaEntradaResponseDTO.valueOf(nota);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        NotaEntrada nota = buscarOuFalhar(id);

        // se algum lote já apareceu em alguma venda (mesmo cancelada), a nota fica para o histórico
        boolean algumVendido = nota.getItens().stream()
                .anyMatch(i -> i.getLote().foiMovimentado() || saidaRepository.existeDoLote(i.getLote().getId()));
        if (algumVendido)
            throw new RegraNegocioException(
                    "Esta nota já teve unidades vendidas e não pode ser excluída. Isso manteria o rastreio incompleto.");

        // estorno: tira do estoque o que esta nota tinha colocado
        for (ItemNotaEntrada item : nota.getItens()) {
            Produto produto = item.getProduto();
            produto.setEstoque(produto.getEstoque() - item.getQuantidade());
        }

        repository.delete(nota);
    }

    @Override
    @Transactional
    public NotaEntradaResponseDTO findById(Long id) {
        return NotaEntradaResponseDTO.valueOf(buscarOuFalhar(id));
    }

    @Override
    @Transactional
    public PaginaDTO<NotaEntradaResponseDTO> findAll(String numero, Long idFornecedor, int page, int pageSize) {
        PanacheQuery<NotaEntrada> consulta = repository.buscar(numero, idFornecedor);
        List<NotaEntradaResponseDTO> itens = consulta.page(page, pageSize)
                .list()
                .stream()
                .map(NotaEntradaResponseDTO::valueOf)
                .toList();
        return PaginaDTO.of(itens, page, pageSize, consulta.count());
    }

    // usa o código que veio da nota ou gera um: LT + data + produto + sequência (ex.: LT261024-007-01)
    private String definirCodigoLote(String informado, NotaEntrada nota, Produto produto, Set<String> codigosDaNota) {
        if (informado != null && !informado.isBlank()) {
            String codigo = informado.trim().toUpperCase();
            if (loteRepository.existeCodigo(codigo) || !codigosDaNota.add(codigo))
                throw new RegraNegocioException("O código de lote " + codigo + " já existe.");
            return codigo;
        }

        String base = "LT" + nota.getDataEntrada().format(FORMATO_LOTE) + "-" + String.format("%03d", produto.getId());
        for (int sequencia = 1; sequencia < 1000; sequencia++) {
            String codigo = base + "-" + String.format("%02d", sequencia);
            if (!loteRepository.existeCodigo(codigo) && codigosDaNota.add(codigo))
                return codigo;
        }
        throw new RegraNegocioException("Não foi possível gerar o código do lote.");
    }

    private NotaEntrada buscarOuFalhar(Long id) {
        return repository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Nota fiscal não encontrada."));
    }
}

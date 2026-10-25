package br.unitins.armas.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import br.unitins.armas.dto.ItemPedidoRequestDTO;
import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.dto.PedidoRequestDTO;
import br.unitins.armas.dto.PedidoResponseDTO;
import br.unitins.armas.exception.CampoInvalidoException;
import br.unitins.armas.exception.RegraNegocioException;
import br.unitins.armas.model.Cliente;
import br.unitins.armas.model.FormaPagamento;
import br.unitins.armas.model.ItemPedido;
import br.unitins.armas.model.Lote;
import br.unitins.armas.model.Pedido;
import br.unitins.armas.model.Produto;
import br.unitins.armas.model.SaidaLote;
import br.unitins.armas.model.SituacaoPedido;
import br.unitins.armas.repository.ClienteRepository;
import br.unitins.armas.repository.LoteRepository;
import br.unitins.armas.repository.PedidoRepository;
import br.unitins.armas.repository.ProdutoRepository;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

// SAÍDA DE ESTOQUE: a venda confere as regras, tira dos lotes mais antigos e grava o rastro
@ApplicationScoped
public class PedidoServiceImpl implements PedidoService {

    // Estatuto do Desarmamento: idade mínima para comprar arma de fogo
    private static final int IDADE_MINIMA_CONTROLADO = 25;

    @Inject
    PedidoRepository repository;

    @Inject
    ClienteRepository clienteRepository;

    @Inject
    ProdutoRepository produtoRepository;

    @Inject
    LoteRepository loteRepository;

    @Override
    @Transactional
    public PedidoResponseDTO criar(Long idUsuario, PedidoRequestDTO dto) {
        Cliente cliente = clienteRepository.findByUsuario(idUsuario);
        if (cliente == null)
            throw new RegraNegocioException(
                    "Complete seus dados e endereço em Minha conta antes de finalizar a compra.");

        FormaPagamento forma = FormaPagamento.buscarPorCodigo(dto.formaPagamento());
        if (forma == null)
            throw new CampoInvalidoException("formaPagamento", "Forma de pagamento inválida.");

        // parcelar só no cartão
        int parcelas = forma == FormaPagamento.CARTAO_CREDITO && dto.parcelas() != null ? dto.parcelas() : 1;

        // se o mesmo produto veio 2 vezes, junta as quantidades
        Map<Long, Integer> quantidades = new LinkedHashMap<>();
        for (ItemPedidoRequestDTO item : dto.itens())
            quantidades.merge(item.idProduto(), item.quantidade(), Integer::sum);

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setData(LocalDateTime.now());
        pedido.setSituacao(SituacaoPedido.PAGO); // pagamento simulado: já entra como pago
        pedido.setFormaPagamento(forma);
        pedido.setParcelas(parcelas);

        BigDecimal total = BigDecimal.ZERO;

        for (Map.Entry<Long, Integer> entrada : quantidades.entrySet()) {
            Produto produto = produtoRepository.findById(entrada.getKey());
            int quantidade = entrada.getValue();

            validarItem(cliente, produto, quantidade);

            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setProduto(produto);
            item.setQuantidade(quantidade);
            item.setPrecoUnitario(produto.getPreco());

            baixarDosLotes(item, quantidade);
            produto.setEstoque(produto.getEstoque() - quantidade); // aqui o estoque DESCE

            pedido.getItens().add(item);
            total = total.add(item.getSubtotal());
        }

        pedido.setValorTotal(total);
        repository.persist(pedido);
        return PedidoResponseDTO.valueOf(pedido);
    }

    // ===== as 3 regras da venda =====
    private void validarItem(Cliente cliente, Produto produto, int quantidade) {
        if (produto == null || !produto.getPublicado())
            throw new RegraNegocioException("Um dos produtos do carrinho não está mais disponível.");

        if (produto.getEstoque() < quantidade)
            throw new RegraNegocioException("Estoque insuficiente para \"" + produto.getNome()
                    + "\": só há " + produto.getEstoque() + " unidade(s).");

        // acessório = venda livre; arma e munição = produto controlado
        if (!produto.getCategoria().isControlada())
            return;

        int idade = Period.between(cliente.getDataNascimento(), LocalDate.now()).getYears();
        if (idade < IDADE_MINIMA_CONTROLADO)
            throw new RegraNegocioException("\"" + produto.getNome() + "\" é um produto controlado e exige idade mínima de "
                    + IDADE_MINIMA_CONTROLADO + " anos.");

        if (!cliente.autorizacaoValida())
            throw new RegraNegocioException("\"" + produto.getNome() + "\" é um produto controlado. "
                    + "Para comprá-lo você precisa de uma autorização de compra aprovada e dentro da validade "
                    + "(envie em Minha conta > Autorização de compra).");
    }

    // tira as unidades do lote mais antigo primeiro e anota de qual lote saiu
    private void baixarDosLotes(ItemPedido item, int quantidade) {
        int falta = quantidade;

        for (Lote lote : loteRepository.disponiveisDoProduto(item.getProduto().getId())) {
            if (falta == 0)
                break;

            int usar = Math.min(falta, lote.getQuantidadeDisponivel());
            lote.setQuantidadeDisponivel(lote.getQuantidadeDisponivel() - usar);

            SaidaLote saida = new SaidaLote();
            saida.setItemPedido(item);
            saida.setLote(lote);
            saida.setQuantidade(usar);
            item.getSaidas().add(saida);

            falta -= usar;
        }

        if (falta > 0)
            throw new RegraNegocioException("Os lotes de \"" + item.getProduto().getNome()
                    + "\" não têm saldo suficiente. Confira as notas de entrada.");
    }

    @Override
    @Transactional
    public PaginaDTO<PedidoResponseDTO> meusPedidos(Long idUsuario, int page, int pageSize) {
        Cliente cliente = clienteRepository.findByUsuario(idUsuario);
        if (cliente == null)
            return PaginaDTO.of(List.of(), page, pageSize, 0);

        return paginar(repository.doCliente(cliente.getId()), page, pageSize);
    }

    @Override
    @Transactional
    public PedidoResponseDTO meuPedido(Long idUsuario, Long idPedido) {
        return PedidoResponseDTO.valueOf(buscarDoUsuario(idUsuario, idPedido));
    }

    @Override
    @Transactional
    public void cancelarMeuPedido(Long idUsuario, Long idPedido) {
        Pedido pedido = buscarDoUsuario(idUsuario, idPedido);
        if (pedido.getSituacao() != SituacaoPedido.PAGO)
            throw new RegraNegocioException("Só dá para cancelar pedidos que ainda não entraram em separação.");
        cancelar(pedido);
    }

    @Override
    @Transactional
    public PaginaDTO<PedidoResponseDTO> findAll(String nomeCliente, String situacao, int page, int pageSize) {
        SituacaoPedido filtro = (situacao == null || situacao.isBlank()) ? null : SituacaoPedido.buscarPorCodigo(situacao);
        return paginar(repository.buscar(nomeCliente, filtro), page, pageSize);
    }

    @Override
    @Transactional
    public PedidoResponseDTO findById(Long id) {
        return PedidoResponseDTO.valueOf(buscarOuFalhar(id));
    }

    @Override
    @Transactional
    public void alterarSituacao(Long id, String situacao) {
        SituacaoPedido nova = SituacaoPedido.buscarPorCodigo(situacao);
        if (nova == null)
            throw new CampoInvalidoException("situacao", "Situação inválida.");

        Pedido pedido = buscarOuFalhar(id);
        if (pedido.getSituacao() == SituacaoPedido.CANCELADO || pedido.getSituacao() == SituacaoPedido.ENTREGUE)
            throw new RegraNegocioException("Pedidos entregues ou cancelados não mudam mais de situação.");

        if (nova == SituacaoPedido.CANCELADO)
            cancelar(pedido);
        else
            pedido.setSituacao(nova);
    }

    // cancelar devolve as unidades para os MESMOS lotes de onde saíram
    private void cancelar(Pedido pedido) {
        for (ItemPedido item : pedido.getItens()) {
            for (SaidaLote saida : item.getSaidas()) {
                Lote lote = saida.getLote();
                lote.setQuantidadeDisponivel(lote.getQuantidadeDisponivel() + saida.getQuantidade());
            }
            Produto produto = item.getProduto();
            produto.setEstoque(produto.getEstoque() + item.getQuantidade());
        }
        pedido.setSituacao(SituacaoPedido.CANCELADO);
    }

    private PaginaDTO<PedidoResponseDTO> paginar(PanacheQuery<Pedido> consulta, int page, int pageSize) {
        List<PedidoResponseDTO> itens = consulta.page(page, pageSize)
                .list()
                .stream()
                .map(PedidoResponseDTO::valueOf)
                .toList();
        return PaginaDTO.of(itens, page, pageSize, consulta.count());
    }

    private Pedido buscarDoUsuario(Long idUsuario, Long idPedido) {
        Pedido pedido = buscarOuFalhar(idPedido);
        if (pedido.getCliente().getUsuario() == null
                || !pedido.getCliente().getUsuario().getId().equals(idUsuario))
            throw new NotFoundException("Pedido não encontrado."); // não conta que o pedido existe
        return pedido;
    }

    private Pedido buscarOuFalhar(Long id) {
        return repository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Pedido não encontrado."));
    }
}

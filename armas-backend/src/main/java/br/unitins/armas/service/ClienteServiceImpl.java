package br.unitins.armas.service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

import br.unitins.armas.dto.AutorizacaoRequestDTO;
import br.unitins.armas.dto.ClienteRequestDTO;
import br.unitins.armas.dto.ClienteResponseDTO;
import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.exception.CampoInvalidoException;
import br.unitins.armas.exception.RegraNegocioException;
import br.unitins.armas.model.Cliente;
import br.unitins.armas.model.SituacaoAutorizacao;
import br.unitins.armas.model.Usuario;
import br.unitins.armas.repository.ClienteRepository;
import br.unitins.armas.repository.PedidoRepository;
import br.unitins.armas.repository.UsuarioRepository;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class ClienteServiceImpl implements ClienteService {

    private static final int IDADE_MINIMA = 18;

    @Inject
    ClienteRepository repository;

    @Inject
    MunicipioService municipioService;

    @Inject
    UsuarioRepository usuarioRepository;

    @Inject
    PedidoRepository pedidoRepository;

    @Override
    @Transactional
    public ClienteResponseDTO create(ClienteRequestDTO dto) {
        validarRegras(dto, null);

        Cliente cliente = new Cliente();
        preencher(cliente, dto);
        repository.persist(cliente);

        return ClienteResponseDTO.valueOf(cliente);
    }

    @Override
    @Transactional
    public void update(Long id, ClienteRequestDTO dto) {
        validarRegras(dto, id);
        preencher(buscarOuFalhar(id), dto);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (pedidoRepository.existeComCliente(id))
            throw new CampoInvalidoException("cliente",
                    "Este cliente tem pedidos e não pode ser excluído (o histórico de vendas precisa ficar).");

        if (!repository.deleteById(id))
            throw new NotFoundException("Cliente não encontrado.");
    }

    @Override
    public ClienteResponseDTO findById(Long id) {
        return ClienteResponseDTO.valueOf(buscarOuFalhar(id));
    }

    @Override
    public PaginaDTO<ClienteResponseDTO> findAll(String nome, String situacaoAutorizacao, int page, int pageSize) {
        SituacaoAutorizacao filtro = (situacaoAutorizacao == null || situacaoAutorizacao.isBlank())
                ? null
                : SituacaoAutorizacao.buscarPorCodigo(situacaoAutorizacao);

        PanacheQuery<Cliente> consulta = repository.buscar(nome, filtro);

        List<ClienteResponseDTO> itens = consulta.page(page, pageSize)
                .list()
                .stream()
                .map(ClienteResponseDTO::valueOf)
                .toList();

        return PaginaDTO.of(itens, page, pageSize, consulta.count());
    }

    @Override
    @Transactional
    public void avaliarAutorizacao(Long idCliente, String situacao) {
        SituacaoAutorizacao nova = SituacaoAutorizacao.buscarPorCodigo(situacao);
        if (nova != SituacaoAutorizacao.APROVADA && nova != SituacaoAutorizacao.RECUSADA)
            throw new CampoInvalidoException("situacao", "Escolha APROVADA ou RECUSADA.");

        Cliente cliente = buscarOuFalhar(idCliente);
        if (cliente.getNumeroAutorizacao() == null)
            throw new RegraNegocioException("Este cliente ainda não enviou uma autorização de compra.");

        cliente.setSituacaoAutorizacao(nova);
    }

    // ===== Minha conta =====

    @Override
    public ClienteResponseDTO buscarDoUsuario(Long idUsuario) {
        Cliente cliente = repository.findByUsuario(idUsuario);
        return cliente == null ? null : ClienteResponseDTO.valueOf(cliente);
    }

    @Override
    @Transactional
    public ClienteResponseDTO salvarDoUsuario(Long idUsuario, ClienteRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByIdOptional(idUsuario)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado."));

        // o e-mail do cadastro é sempre o e-mail do login
        ClienteRequestDTO dados = comEmail(dto, usuario.getEmail());

        Cliente cliente = repository.findByUsuario(idUsuario);

        // se o admin já tinha cadastrado esse cliente pelo e-mail, liga a conta a ele
        if (cliente == null) {
            Cliente existente = repository.findByEmail(usuario.getEmail());
            if (existente != null && existente.getUsuario() == null)
                cliente = existente;
        }

        if (cliente == null) {
            validarRegras(dados, null);
            cliente = new Cliente();
            preencher(cliente, dados);
            cliente.setUsuario(usuario);
            repository.persist(cliente);
        } else {
            validarRegras(dados, cliente.getId());
            preencher(cliente, dados);
            cliente.setUsuario(usuario);
        }

        usuario.setNome(cliente.getNome());
        return ClienteResponseDTO.valueOf(cliente);
    }

    @Override
    @Transactional
    public ClienteResponseDTO enviarAutorizacao(Long idUsuario, AutorizacaoRequestDTO dto) {
        Cliente cliente = repository.findByUsuario(idUsuario);
        if (cliente == null)
            throw new RegraNegocioException("Preencha primeiro seus dados pessoais e endereço.");

        cliente.setNumeroAutorizacao(dto.numero().trim().toUpperCase());
        cliente.setValidadeAutorizacao(dto.validade());
        cliente.setSituacaoAutorizacao(SituacaoAutorizacao.EM_ANALISE); // a loja confere e aprova no painel
        return ClienteResponseDTO.valueOf(cliente);
    }

    private ClienteRequestDTO comEmail(ClienteRequestDTO dto, String email) {
        return new ClienteRequestDTO(dto.nome(), email, dto.cpf(), dto.dataNascimento(), dto.telefone(),
                dto.cep(), dto.logradouro(), dto.numero(), dto.complemento(), dto.bairro(), dto.cidade(), dto.uf());
    }

    private void validarRegras(ClienteRequestDTO dto, Long idIgnorado) {
        if (!cpfValido(dto.cpf()))
            throw new CampoInvalidoException("cpf", "CPF inválido.");

        if (repository.existeCpf(dto.cpf(), idIgnorado))
            throw new CampoInvalidoException("cpf", "Já existe um cliente com esse CPF.");

        if (repository.existeEmail(dto.email().trim(), idIgnorado))
            throw new CampoInvalidoException("email", "Já existe um cliente com esse e-mail.");

        int idade = Period.between(dto.dataNascimento(), LocalDate.now()).getYears();
        if (idade < IDADE_MINIMA)
            throw new CampoInvalidoException("dataNascimento",
                    "O cliente deve ter pelo menos " + IDADE_MINIMA + " anos.");
    }

    private boolean cpfValido(String cpf) {
        if (cpf == null || !cpf.matches("\\d{11}"))
            return false;

        if (cpf.chars().distinct().count() == 1)
            return false;

        for (int posicao = 9; posicao <= 10; posicao++) {
            int soma = 0;
            for (int i = 0; i < posicao; i++)
                soma += (cpf.charAt(i) - '0') * (posicao + 1 - i);

            int digito = (soma * 10) % 11;
            if (digito == 10)
                digito = 0;

            if (digito != cpf.charAt(posicao) - '0')
                return false;
        }
        return true;
    }

    private void preencher(Cliente cliente, ClienteRequestDTO dto) {
        cliente.setNome(dto.nome().trim());
        cliente.setEmail(dto.email().trim().toLowerCase());
        cliente.setCpf(dto.cpf());
        cliente.setDataNascimento(dto.dataNascimento());
        cliente.setTelefone(dto.telefone());

        cliente.setCep(dto.cep());
        cliente.setLogradouro(dto.logradouro().trim());
        cliente.setNumero(dto.numero().trim());
        cliente.setComplemento(
                dto.complemento() == null || dto.complemento().isBlank() ? null : dto.complemento().trim());
        cliente.setBairro(dto.bairro().trim());

        cliente.setMunicipio(municipioService.buscarOuCriar(dto.cidade(), dto.uf()));
    }

    private Cliente buscarOuFalhar(Long id) {
        return repository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Cliente não encontrado."));
    }
}
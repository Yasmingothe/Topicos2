package br.unitins.armas.service;

import java.util.List;

import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.dto.UsuarioRequestDTO;
import br.unitins.armas.dto.UsuarioResponseDTO;
import br.unitins.armas.exception.CampoInvalidoException;
import br.unitins.armas.exception.RegraNegocioException;
import br.unitins.armas.model.Perfil;
import br.unitins.armas.model.Usuario;
import br.unitins.armas.repository.UsuarioRepository;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class UsuarioServiceImpl implements UsuarioService {

    @Inject
    UsuarioRepository repository;

    @Inject
    SenhaService senhaService;

    @Override
    @Transactional
    public UsuarioResponseDTO create(UsuarioRequestDTO dto) {
        Perfil perfil = Perfil.buscarPorCodigo(dto.perfil());
        if (perfil == null)
            throw new CampoInvalidoException("perfil", "Perfil inválido.");

        if (repository.existeEmail(dto.email(), null))
            throw new CampoInvalidoException("email", "Já existe um usuário com esse e-mail.");

        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome().trim());
        usuario.setEmail(dto.email().trim().toLowerCase());
        usuario.setSenha(senhaService.gerarHash(dto.senha()));
        usuario.setPerfil(perfil);
        repository.persist(usuario);

        return UsuarioResponseDTO.valueOf(usuario);
    }

    @Override
    @Transactional
    public void alterarAtivo(Long id, boolean ativo, Long idUsuarioLogado) {
        Usuario usuario = repository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado."));

        if (!ativo && id.equals(idUsuarioLogado))
            throw new RegraNegocioException("Você não pode desativar o seu próprio usuário.");

        if (!ativo && usuario.getPerfil() == Perfil.ADMIN && usuario.getAtivo()
                && repository.contarAdminsAtivos() <= 1)
            throw new RegraNegocioException("Este é o último administrador ativo e não pode ser desativado.");

        usuario.setAtivo(ativo);
    }

    @Override
    public PaginaDTO<UsuarioResponseDTO> findAll(String nome, String perfil, int page, int pageSize) {
        Perfil filtroPerfil = (perfil == null || perfil.isBlank()) ? null : Perfil.buscarPorCodigo(perfil);

        PanacheQuery<Usuario> consulta = repository.buscar(nome, filtroPerfil);
        List<UsuarioResponseDTO> itens = consulta.page(page, pageSize)
                .list()
                .stream()
                .map(UsuarioResponseDTO::valueOf)
                .toList();

        return PaginaDTO.of(itens, page, pageSize, consulta.count());
    }
}

package br.unitins.armas.service;

import br.unitins.armas.dto.CadastroContaDTO;
import br.unitins.armas.dto.LoginDTO;
import br.unitins.armas.dto.TokenResponseDTO;
import br.unitins.armas.dto.UsuarioResponseDTO;
import br.unitins.armas.exception.CampoInvalidoException;
import br.unitins.armas.model.Perfil;
import br.unitins.armas.model.Usuario;
import br.unitins.armas.repository.UsuarioRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class AuthServiceImpl implements AuthService {

    @Inject
    UsuarioRepository repository;

    @Inject
    SenhaService senhaService;

    @Inject
    JwtService jwtService;

    @Override
    public TokenResponseDTO login(LoginDTO dto) {
        Usuario usuario = repository.findByEmail(dto.email());

        // mesma mensagem para e-mail errado e senha errada: não dá pista para quem tenta adivinhar
        if (usuario == null || !senhaService.confere(dto.senha(), usuario.getSenha()))
            throw new CampoInvalidoException("senha", "E-mail ou senha incorretos.");

        if (!usuario.getAtivo())
            throw new CampoInvalidoException("email", "Este usuário está desativado. Fale com o administrador.");

        return gerarResposta(usuario);
    }

    @Override
    @Transactional
    public TokenResponseDTO cadastrar(CadastroContaDTO dto) {
        if (repository.existeEmail(dto.email(), null))
            throw new CampoInvalidoException("email", "Já existe uma conta com esse e-mail.");

        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome().trim());
        usuario.setEmail(dto.email().trim().toLowerCase());
        usuario.setSenha(senhaService.gerarHash(dto.senha()));
        usuario.setPerfil(Perfil.CLIENTE); // quem se cadastra pela loja é sempre cliente
        repository.persist(usuario);

        return gerarResposta(usuario);
    }

    @Override
    public UsuarioResponseDTO buscarUsuario(Long idUsuario) {
        Usuario usuario = repository.findByIdOptional(idUsuario)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado."));
        return UsuarioResponseDTO.valueOf(usuario);
    }

    private TokenResponseDTO gerarResposta(Usuario usuario) {
        return new TokenResponseDTO(jwtService.gerarToken(usuario), UsuarioResponseDTO.valueOf(usuario));
    }
}

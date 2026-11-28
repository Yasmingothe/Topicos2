package br.unitins.armas.service;

import br.unitins.armas.dto.UsuarioResponseDTO;
import br.unitins.armas.model.Usuario;
import br.unitins.armas.repository.UsuarioRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class AuthServiceImpl implements AuthService {

    @Inject
    UsuarioRepository repository;

    @Override
    public UsuarioResponseDTO buscarUsuario(Long idUsuario) {
        Usuario usuario = repository.findByIdOptional(idUsuario)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado."));
        return UsuarioResponseDTO.valueOf(usuario);
    }
}

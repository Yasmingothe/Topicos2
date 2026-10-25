package br.unitins.armas.dto;

import java.time.LocalDateTime;

import br.unitins.armas.model.Usuario;

public record UsuarioResponseDTO(
    Long id,
    String nome,
    String email,
    OpcaoDTO perfil,
    Boolean ativo,
    LocalDateTime dataCadastro
) {
    public static UsuarioResponseDTO valueOf(Usuario usuario) {
        return new UsuarioResponseDTO(
            usuario.getId(),
            usuario.getNome(),
            usuario.getEmail(),
            new OpcaoDTO(usuario.getPerfil().name(), usuario.getPerfil().getNome()),
            usuario.getAtivo(),
            usuario.getDataCadastro()
        );
    }
}

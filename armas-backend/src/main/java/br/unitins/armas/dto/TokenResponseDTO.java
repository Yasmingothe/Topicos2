package br.unitins.armas.dto;

// resposta do login: o token (o "crachá") e quem é o usuário
public record TokenResponseDTO(String token, UsuarioResponseDTO usuario) {
}

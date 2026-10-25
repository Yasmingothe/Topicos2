package br.unitins.armas.dto;

// formato padrão para devolver um enum ao front: código (para salvar) e nome (para mostrar)
public record OpcaoDTO(String codigo, String nome) {
}

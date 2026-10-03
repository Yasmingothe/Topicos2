package br.unitins.armas.dto;

import java.util.List;

public record PaginaDTO<T>(
    List<T> items,
    int page,
    int pageSize,
    long totalItems,
    int totalPages
) {
    public static <T> PaginaDTO<T> of(List<T> items, int page, int pageSize, long totalItems) {
        int totalPages = (int) Math.ceil((double) totalItems / pageSize);
        return new PaginaDTO<>(items, page, pageSize, totalItems, totalPages);
    }
}
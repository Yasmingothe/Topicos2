package br.unitins.armas.exception;

import java.util.List;

public record ErroResponse(
    int status,
    String message,
    List<CampoErro> errors
) {
    public record CampoErro(String field, String message) {
    }
}
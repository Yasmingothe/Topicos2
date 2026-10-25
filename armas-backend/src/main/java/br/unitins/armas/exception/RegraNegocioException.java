package br.unitins.armas.exception;

// erro de regra de negócio que não é de um campo só
// (ex.: "estoque insuficiente", "cliente sem autorização de compra")
public class RegraNegocioException extends RuntimeException {

    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}

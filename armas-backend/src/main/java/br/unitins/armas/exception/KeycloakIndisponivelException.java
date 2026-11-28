package br.unitins.armas.exception;

// 503: o Keycloak não respondeu (container parado, porta errada...)
public class KeycloakIndisponivelException extends RuntimeException {

    public KeycloakIndisponivelException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }

    public KeycloakIndisponivelException(String mensagem) {
        super(mensagem);
    }
}

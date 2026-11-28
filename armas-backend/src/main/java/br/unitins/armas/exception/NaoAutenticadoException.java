package br.unitins.armas.exception;

// 401: a pessoa não está logada ou a sessão acabou (precisa entrar de novo)
public class NaoAutenticadoException extends RuntimeException {

    public NaoAutenticadoException(String mensagem) {
        super(mensagem);
    }
}

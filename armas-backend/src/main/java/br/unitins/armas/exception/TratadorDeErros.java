package br.unitins.armas.exception;

import java.util.List;

import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

import br.unitins.armas.exception.ErroResponse.CampoErro;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Path;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

public class TratadorDeErros {

    @ServerExceptionMapper
    public Response validacaoDoDTO(ConstraintViolationException e) {
        List<CampoErro> erros = e.getConstraintViolations()
                .stream()
                .map(v -> new CampoErro(nomeDoCampo(v.getPropertyPath()), v.getMessage()))
                .toList();

        return resposta(Status.BAD_REQUEST, "Um ou mais campos estão inválidos.", erros);
    }

    @ServerExceptionMapper
    public Response campoInvalido(CampoInvalidoException e) {
        CampoErro erro = new CampoErro(e.getCampo(), e.getMessage());
        return resposta(Status.BAD_REQUEST, e.getMessage(), List.of(erro));
    }

    @ServerExceptionMapper
    public Response naoEncontrado(NotFoundException e) {
        return resposta(Status.NOT_FOUND, e.getMessage(), List.of());
    }

    private String nomeDoCampo(Path caminho) {
        String nome = null;
        for (Path.Node parte : caminho)
            nome = parte.getName();
        return nome;
    }

    private Response resposta(Status status, String mensagem, List<CampoErro> erros) {
        ErroResponse corpo = new ErroResponse(status.getStatusCode(), mensagem, erros);
        return Response.status(status)
                .type(MediaType.APPLICATION_JSON)
                .entity(corpo)
                .build();
    }
}
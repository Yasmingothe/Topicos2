package br.unitins.armas.exception;

import java.util.List;

import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

import br.unitins.armas.exception.ErroResponse.CampoErro;
import io.quarkus.security.AuthenticationFailedException;
import io.quarkus.security.ForbiddenException;
import io.quarkus.security.UnauthorizedException;
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
    public Response regraDeNegocio(RegraNegocioException e) {
        return resposta(Status.BAD_REQUEST, e.getMessage(), List.of());
    }

    @ServerExceptionMapper
    public Response naoEncontrado(NotFoundException e) {
        return resposta(Status.NOT_FOUND, e.getMessage(), List.of());
    }

    // ===== segurança (Keycloak) =====

    // 401 = não está logado, ou o token venceu / é inválido
    @ServerExceptionMapper
    public Response naoLogado(UnauthorizedException e) {
        return resposta(Status.UNAUTHORIZED, "Faça login para continuar.", List.of());
    }

    @ServerExceptionMapper
    public Response tokenInvalido(AuthenticationFailedException e) {
        return resposta(Status.UNAUTHORIZED, "Sua sessão expirou. Entre novamente.", List.of());
    }

    @ServerExceptionMapper
    public Response naoAutenticado(NaoAutenticadoException e) {
        return resposta(Status.UNAUTHORIZED, e.getMessage(), List.of());
    }

    // 403 = está logado, mas o papel dele não pode usar esta função (ex.: CLIENTE no painel)
    @ServerExceptionMapper
    public Response semPermissao(ForbiddenException e) {
        return resposta(Status.FORBIDDEN, "Você não tem permissão para acessar este recurso.", List.of());
    }

    // 503 = o Keycloak está fora do ar
    @ServerExceptionMapper
    public Response keycloakForaDoAr(KeycloakIndisponivelException e) {
        return resposta(Status.SERVICE_UNAVAILABLE, e.getMessage(), List.of());
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
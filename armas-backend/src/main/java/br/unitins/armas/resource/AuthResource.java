package br.unitins.armas.resource;

import org.eclipse.microprofile.jwt.JsonWebToken;

import br.unitins.armas.dto.CadastroContaDTO;
import br.unitins.armas.dto.LoginDTO;
import br.unitins.armas.dto.TokenResponseDTO;
import br.unitins.armas.dto.UsuarioResponseDTO;
import br.unitins.armas.service.AuthService;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    AuthService service;

    // o token que chegou na requisição (já conferido pelo Quarkus)
    @Inject
    JsonWebToken jwt;

    @POST
    @Path("/login")
    @PermitAll
    public TokenResponseDTO login(@Valid LoginDTO dto) {
        return service.login(dto);
    }

    @POST
    @Path("/cadastro")
    @PermitAll
    public Response cadastrar(@Valid CadastroContaDTO dto) {
        return Response.status(Status.CREATED).entity(service.cadastrar(dto)).build();
    }

    // quem sou eu? (usado pelo front para conferir se o token ainda vale)
    @GET
    @Path("/eu")
    @RolesAllowed({ "ADMIN", "CLIENTE" })
    public UsuarioResponseDTO eu() {
        return service.buscarUsuario(Long.valueOf(jwt.getSubject()));
    }
}

package br.unitins.armas.resource;

import org.eclipse.microprofile.jwt.JsonWebToken;

import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.dto.UsuarioRequestDTO;
import br.unitins.armas.dto.UsuarioResponseDTO;
import br.unitins.armas.service.UsuarioService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

@Path("/usuarios")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("ADMIN")
public class UsuarioResource {

    @Inject
    UsuarioService service;

    @Inject
    JsonWebToken jwt;

    @GET
    public PaginaDTO<UsuarioResponseDTO> listar(
            @QueryParam("nome") String nome,
            @QueryParam("perfil") String perfil,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("pageSize") @DefaultValue("10") int pageSize) {
        return service.findAll(nome, perfil, page, pageSize);
    }

    @POST
    public Response incluir(@Valid UsuarioRequestDTO dto) {
        return Response.status(Status.CREATED).entity(service.create(dto)).build();
    }

    @PATCH
    @Path("/{id}/ativar")
    public void ativar(@PathParam("id") Long id) {
        service.alterarAtivo(id, true, Long.valueOf(jwt.getSubject()));
    }

    @PATCH
    @Path("/{id}/desativar")
    public void desativar(@PathParam("id") Long id) {
        service.alterarAtivo(id, false, Long.valueOf(jwt.getSubject()));
    }
}

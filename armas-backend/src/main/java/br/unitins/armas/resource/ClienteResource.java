package br.unitins.armas.resource;

import br.unitins.armas.dto.ClienteRequestDTO;
import br.unitins.armas.dto.ClienteResponseDTO;
import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.dto.SituacaoDTO;
import br.unitins.armas.service.ClienteService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

@Path("/clientes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("ADMIN")
public class ClienteResource {

    @Inject
    ClienteService service;

    @GET
    public PaginaDTO<ClienteResponseDTO> listar(
            @QueryParam("nome") String nome,
            @QueryParam("autorizacao") String autorizacao,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("pageSize") @DefaultValue("10") int pageSize) {
        return service.findAll(nome, autorizacao, page, pageSize);
    }

    @GET
    @Path("/{id}")
    public ClienteResponseDTO buscarPorId(@PathParam("id") Long id) {
        return service.findById(id);
    }

    @POST
    public Response incluir(@Valid ClienteRequestDTO dto) {
        return Response.status(Status.CREATED).entity(service.create(dto)).build();
    }

    @PUT
    @Path("/{id}")
    public void alterar(@PathParam("id") Long id, @Valid ClienteRequestDTO dto) {
        service.update(id, dto);
    }

    @DELETE
    @Path("/{id}")
    public void excluir(@PathParam("id") Long id) {
        service.delete(id);
    }

    // aprovar ou recusar a autorização de compra enviada pelo cliente
    @PATCH
    @Path("/{id}/autorizacao")
    public void avaliarAutorizacao(@PathParam("id") Long id, @Valid SituacaoDTO dto) {
        service.avaliarAutorizacao(id, dto.situacao());
    }
}

package br.unitins.armas.resource;

import br.unitins.armas.dto.NotaEntradaRequestDTO;
import br.unitins.armas.dto.NotaEntradaResponseDTO;
import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.service.NotaEntradaService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

// nota fiscal não tem PUT: documento fiscal não se edita. Errou? exclui (se nada foi vendido) e lança de novo.
@Path("/notas-entrada")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("ADMIN")
public class NotaEntradaResource {

    @Inject
    NotaEntradaService service;

    @GET
    public PaginaDTO<NotaEntradaResponseDTO> listar(
            @QueryParam("numero") String numero,
            @QueryParam("idFornecedor") Long idFornecedor,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("pageSize") @DefaultValue("10") int pageSize) {
        return service.findAll(numero, idFornecedor, page, pageSize);
    }

    @GET
    @Path("/{id}")
    public NotaEntradaResponseDTO buscarPorId(@PathParam("id") Long id) {
        return service.findById(id);
    }

    @POST
    public Response incluir(@Valid NotaEntradaRequestDTO dto) {
        return Response.status(Status.CREATED).entity(service.create(dto)).build();
    }

    @DELETE
    @Path("/{id}")
    public void excluir(@PathParam("id") Long id) {
        service.delete(id);
    }
}

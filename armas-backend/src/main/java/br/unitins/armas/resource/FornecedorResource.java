package br.unitins.armas.resource;

import br.unitins.armas.dto.FornecedorRequestDTO;
import br.unitins.armas.dto.FornecedorResponseDTO;
import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.service.FornecedorService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

@Path("/fornecedores")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("ADMIN")
public class FornecedorResource {

    @Inject
    FornecedorService service;

    @GET
    public PaginaDTO<FornecedorResponseDTO> listar(
            @QueryParam("busca") String busca,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("pageSize") @DefaultValue("10") int pageSize) {
        return service.findAll(busca, page, pageSize);
    }

    @GET
    @Path("/{id}")
    public FornecedorResponseDTO buscarPorId(@PathParam("id") Long id) {
        return service.findById(id);
    }

    @POST
    public Response incluir(@Valid FornecedorRequestDTO dto) {
        return Response.status(Status.CREATED).entity(service.create(dto)).build();
    }

    @PUT
    @Path("/{id}")
    public void alterar(@PathParam("id") Long id, @Valid FornecedorRequestDTO dto) {
        service.update(id, dto);
    }

    @DELETE
    @Path("/{id}")
    public void excluir(@PathParam("id") Long id) {
        service.delete(id);
    }
}

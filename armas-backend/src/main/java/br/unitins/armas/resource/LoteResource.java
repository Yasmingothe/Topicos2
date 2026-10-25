package br.unitins.armas.resource;

import br.unitins.armas.dto.LoteResponseDTO;
import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.dto.RastreioLoteDTO;
import br.unitins.armas.service.LoteService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("/lotes")
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed("ADMIN")
public class LoteResource {

    @Inject
    LoteService service;

    @GET
    public PaginaDTO<LoteResponseDTO> listar(
            @QueryParam("codigo") String codigo,
            @QueryParam("idProduto") Long idProduto,
            @QueryParam("comSaldo") Boolean comSaldo,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("pageSize") @DefaultValue("10") int pageSize) {
        return service.findAll(codigo, idProduto, comSaldo, page, pageSize);
    }

    @GET
    @Path("/{id}/rastreio")
    public RastreioLoteDTO rastrear(@PathParam("id") Long id) {
        return service.rastrear(id);
    }
}

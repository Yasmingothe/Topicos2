package br.unitins.armas.resource;

import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.dto.PedidoResponseDTO;
import br.unitins.armas.dto.SituacaoDTO;
import br.unitins.armas.service.PedidoService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

// pedidos vistos pelo PAINEL (o cliente compra pelo /minha-conta/pedidos)
@Path("/pedidos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("ADMIN")
public class PedidoResource {

    @Inject
    PedidoService service;

    @GET
    public PaginaDTO<PedidoResponseDTO> listar(
            @QueryParam("cliente") String cliente,
            @QueryParam("situacao") String situacao,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("pageSize") @DefaultValue("10") int pageSize) {
        return service.findAll(cliente, situacao, page, pageSize);
    }

    @GET
    @Path("/{id}")
    public PedidoResponseDTO buscarPorId(@PathParam("id") Long id) {
        return service.findById(id);
    }

    @PATCH
    @Path("/{id}/situacao")
    public void alterarSituacao(@PathParam("id") Long id, @Valid SituacaoDTO dto) {
        service.alterarSituacao(id, dto.situacao());
    }
}

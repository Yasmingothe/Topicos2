package br.unitins.armas.resource;

import br.unitins.armas.dto.AutorizacaoRequestDTO;
import br.unitins.armas.dto.ClienteRequestDTO;
import br.unitins.armas.dto.ClienteResponseDTO;
import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.dto.PedidoRequestDTO;
import br.unitins.armas.dto.PedidoResponseDTO;
import br.unitins.armas.service.ClienteService;
import br.unitins.armas.service.PedidoService;
import br.unitins.armas.service.UsuarioLogadoHelper;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
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

// tudo do cliente LOGADO: o id vem do token OIDC, resolvido pelo helper
@Path("/minha-conta")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("CLIENTE")
public class MinhaContaResource {

    @Inject
    ClienteService clienteService;

    @Inject
    PedidoService pedidoService;

    @Inject
    UsuarioLogadoHelper helper;

    private Long idUsuario() {
        return helper.getIdUsuarioLogado();
    }

    // ===== dados e endereço =====

    @GET
    @Path("/cliente")
    public Response meusDados() {
        ClienteResponseDTO cliente = clienteService.buscarDoUsuario(idUsuario());
        // 204 = ainda não preencheu os dados
        return cliente == null ? Response.noContent().build() : Response.ok(cliente).build();
    }

    @PUT
    @Path("/cliente")
    public ClienteResponseDTO salvarDados(@Valid ClienteRequestDTO dto) {
        return clienteService.salvarDoUsuario(idUsuario(), dto);
    }

    @PUT
    @Path("/autorizacao")
    public ClienteResponseDTO enviarAutorizacao(@Valid AutorizacaoRequestDTO dto) {
        return clienteService.enviarAutorizacao(idUsuario(), dto);
    }

    // ===== pedidos =====

    @POST
    @Path("/pedidos")
    public Response finalizarCompra(@Valid PedidoRequestDTO dto) {
        return Response.status(Status.CREATED).entity(pedidoService.criar(idUsuario(), dto)).build();
    }

    @GET
    @Path("/pedidos")
    public PaginaDTO<PedidoResponseDTO> meusPedidos(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("pageSize") @DefaultValue("10") int pageSize) {
        return pedidoService.meusPedidos(idUsuario(), page, pageSize);
    }

    @GET
    @Path("/pedidos/{id}")
    public PedidoResponseDTO meuPedido(@PathParam("id") Long id) {
        return pedidoService.meuPedido(idUsuario(), id);
    }

    @PATCH
    @Path("/pedidos/{id}/cancelar")
    public void cancelar(@PathParam("id") Long id) {
        pedidoService.cancelarMeuPedido(idUsuario(), id);
    }
}

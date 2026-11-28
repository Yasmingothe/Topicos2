package br.unitins.armas.resource;

import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.dto.UsuarioResponseDTO;
import br.unitins.armas.service.UsuarioLogadoHelper;
import br.unitins.armas.service.UsuarioService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("/usuarios")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("ADMIN")
public class UsuarioResource {

    @Inject
    UsuarioService service;

    @Inject
    UsuarioLogadoHelper helper;

    @GET
    public PaginaDTO<UsuarioResponseDTO> listar(
            @QueryParam("nome") String nome,
            @QueryParam("perfil") String perfil,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("pageSize") @DefaultValue("10") int pageSize) {
        return service.findAll(nome, perfil, page, pageSize);
    }

    @PATCH
    @Path("/{id}/ativar")
    public void ativar(@PathParam("id") Long id) {
        service.alterarAtivo(id, true, helper.getIdUsuarioLogado());
    }

    @PATCH
    @Path("/{id}/desativar")
    public void desativar(@PathParam("id") Long id) {
        service.alterarAtivo(id, false, helper.getIdUsuarioLogado());
    }
}

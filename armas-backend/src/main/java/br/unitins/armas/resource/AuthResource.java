package br.unitins.armas.resource;

import br.unitins.armas.dto.UsuarioResponseDTO;
import br.unitins.armas.service.UsuarioLogadoHelper;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    UsuarioLogadoHelper helper;

    // quem sou eu? (usado pelo front para obter os dados do usuário local autenticado via OIDC)
    @GET
    @Path("/eu")
    @RolesAllowed({ "ADMIN", "CLIENTE" })
    public UsuarioResponseDTO eu() {
        return UsuarioResponseDTO.valueOf(helper.getUsuarioLogado());
    }
}

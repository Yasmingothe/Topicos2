package br.unitins.armas.resource;

import br.unitins.armas.dto.ResumoDashboardDTO;
import br.unitins.armas.service.DashboardService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/dashboard")
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed("ADMIN")
public class DashboardResource {

    @Inject
    DashboardService service;

    @GET
    @Path("/resumo")
    public ResumoDashboardDTO resumo() {
        return service.resumo();
    }
}

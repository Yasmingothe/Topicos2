package br.unitins.armas.resource;

import java.util.List;

import br.unitins.armas.dto.EstadoResponseDTO;
import br.unitins.armas.repository.EstadoRepository;
import io.quarkus.panache.common.Sort;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/estados")
@Produces(MediaType.APPLICATION_JSON)
public class EstadoResource {

    @Inject
    EstadoRepository repository;

    @GET
    public List<EstadoResponseDTO> listar() {
        return repository.listAll(Sort.by("nome"))
                .stream()
                .map(EstadoResponseDTO::valueOf)
                .toList();
    }
}
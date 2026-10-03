package br.unitins.armas.resource;

import java.util.Arrays;
import java.util.List;

import br.unitins.armas.dto.CategoriaDTO;
import br.unitins.armas.model.Categoria;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/categorias")
@Produces(MediaType.APPLICATION_JSON)
public class CategoriaResource {

    @GET
    public List<CategoriaDTO> listar() {
        return Arrays.stream(Categoria.values())
                .map(CategoriaDTO::valueOf)
                .toList();
    }
}
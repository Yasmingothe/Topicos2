package br.unitins.armas.resource;

import java.nio.file.Files;
import java.nio.file.Path;

import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import br.unitins.armas.dto.PaginaDTO;
import br.unitins.armas.dto.ProdutoRequestDTO;
import br.unitins.armas.dto.ProdutoResponseDTO;
import br.unitins.armas.service.ProdutoService;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

@jakarta.ws.rs.Path("/produtos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("ADMIN") // por padrão, só o admin; os GET públicos estão marcados com @PermitAll
public class ProdutoResource {

    @Inject
    ProdutoService service;

    // quem está chamando (anônimo, CLIENTE ou ADMIN)
    @Inject
    SecurityIdentity identidade;

    private boolean ehAdmin() {
        return identidade.hasRole("ADMIN");
    }

    @GET
    @PermitAll
    public PaginaDTO<ProdutoResponseDTO> listar(
            @QueryParam("nome") String nome,
            @QueryParam("idMarca") Long idMarca,
            @QueryParam("categoria") String categoria,
            @QueryParam("publicado") Boolean publicado,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("pageSize") @DefaultValue("10") int pageSize) {
        // quem não é admin (a loja) só enxerga os publicados, mesmo que peça outra coisa
        Boolean filtroPublicado = ehAdmin() ? publicado : Boolean.TRUE;
        return service.findAll(nome, idMarca, categoria, filtroPublicado, page, pageSize);
    }

    @GET
    @jakarta.ws.rs.Path("/{id}")
    @PermitAll
    public ProdutoResponseDTO buscarPorId(@PathParam("id") Long id) {
        ProdutoResponseDTO produto = service.findById(id);
        if (!ehAdmin() && !produto.publicado())
            throw new NotFoundException("Produto não encontrado.");
        return produto;
    }

    @POST
    public Response incluir(@Valid ProdutoRequestDTO dto) {
        return Response.status(Status.CREATED).entity(service.create(dto)).build();
    }

    @PUT
    @jakarta.ws.rs.Path("/{id}")
    public void alterar(@PathParam("id") Long id, @Valid ProdutoRequestDTO dto) {
        service.update(id, dto);
    }

    @DELETE
    @jakarta.ws.rs.Path("/{id}")
    public void excluir(@PathParam("id") Long id) {
        service.delete(id);
    }

    // ===== FOTO DO PRODUTO =====

    // devolve o arquivo da foto (usado no <img src="...">)
    @GET
    @jakarta.ws.rs.Path("/{id}/imagem")
    @PermitAll
    @Produces({ "image/jpeg", "image/png", "image/webp", MediaType.APPLICATION_JSON })
    public Response imagem(@PathParam("id") Long id) {
        Path caminho = service.caminhoImagem(id);
        String tipo;
        try {
            tipo = Files.probeContentType(caminho);
        } catch (Exception e) {
            tipo = null;
        }
        return Response.ok(caminho.toFile())
                .type(tipo != null ? tipo : "image/jpeg")
                .header("Cache-Control", "no-cache") // sempre confere se a foto mudou
                .build();
    }

    // recebe a foto enviada pelo formulário (multipart = envio de arquivo)
    @POST
    @jakarta.ws.rs.Path("/{id}/imagem")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public void enviarImagem(@PathParam("id") Long id, @RestForm("imagem") FileUpload imagem) {
        service.salvarImagem(id, imagem);
    }

    @DELETE
    @jakarta.ws.rs.Path("/{id}/imagem")
    public void removerImagem(@PathParam("id") Long id) {
        service.removerImagem(id);
    }
}

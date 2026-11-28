package br.unitins.armas.resource;

import br.unitins.armas.dto.AlterarSenhaDTO;
import br.unitins.armas.dto.CadastroContaDTO;
import br.unitins.armas.dto.EsqueciSenhaDTO;
import br.unitins.armas.dto.RedefinirSenhaDTO;
import br.unitins.armas.dto.LoginDTO;
import br.unitins.armas.dto.RefreshTokenDTO;
import br.unitins.armas.dto.TokenResponseDTO;
import br.unitins.armas.dto.UsuarioResponseDTO;
import br.unitins.armas.service.AuthService;
import br.unitins.armas.service.RecuperacaoSenhaService;
import br.unitins.armas.service.UsuarioLogado;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

// porta de entrada do login: o Angular só fala com estes endpoints,
// e o back é quem conversa com o Keycloak
@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    AuthService service;

    @Inject
    UsuarioLogado usuarioLogado;

    @Inject
    RecuperacaoSenhaService recuperacaoSenha;

    // e-mail + senha -> tokens do Keycloak
    @POST
    @Path("/login")
    @PermitAll
    public TokenResponseDTO login(@Valid LoginDTO dto) {
        return service.login(dto);
    }

    // cria a conta no Keycloak (papel CLIENTE) e no nosso banco, e já entra
    @POST
    @Path("/cadastro")
    @PermitAll
    public Response cadastrar(@Valid CadastroContaDTO dto) {
        return Response.status(Status.CREATED).entity(service.cadastrar(dto)).build();
    }

    // o access token venceu: troca o refresh token por um novo (sem pedir a senha)
    @POST
    @Path("/renovar")
    @PermitAll
    public TokenResponseDTO renovar(@Valid RefreshTokenDTO dto) {
        return service.renovar(dto.refreshToken());
    }

    // sair: encerra a sessão no Keycloak (o refresh token deixa de valer)
    @POST
    @Path("/logout")
    @PermitAll
    public Response sair(@Valid RefreshTokenDTO dto) {
        service.sair(dto.refreshToken());
        return Response.noContent().build();
    }

    // trocar a senha estando logado (confere a atual e troca no Keycloak)
    @PUT
    @Path("/senha")
    @RolesAllowed({ "ADMIN", "CLIENTE" })
    public Response alterarSenha(@Valid AlterarSenhaDTO dto) {
        service.alterarSenha(usuarioLogado.get(), dto);
        return Response.noContent().build();
    }

    // "Esqueci minha senha": manda o link por e-mail.
    // responde 204 mesmo se o e-mail não existir (para não revelar quem tem conta)
    @POST
    @Path("/esqueci-senha")
    @PermitAll
    public Response esqueciSenha(@Valid EsqueciSenhaDTO dto) {
        recuperacaoSenha.solicitar(dto.email());
        return Response.noContent().build();
    }

    // tela aberta pelo link do e-mail: confere o código e troca a senha no Keycloak
    @POST
    @Path("/redefinir-senha")
    @PermitAll
    public Response redefinirSenha(@Valid RedefinirSenhaDTO dto) {
        recuperacaoSenha.redefinir(dto.token(), dto.novaSenha());
        return Response.noContent().build();
    }

    // quem sou eu? (o front usa para conferir a sessão e mostrar nome/perfil)
    @GET
    @Path("/eu")
    @RolesAllowed({ "ADMIN", "CLIENTE" })
    public UsuarioResponseDTO eu() {
        return UsuarioResponseDTO.valueOf(usuarioLogado.get());
    }
}

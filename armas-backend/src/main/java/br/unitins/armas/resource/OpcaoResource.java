package br.unitins.armas.resource;

import java.util.Arrays;
import java.util.List;

import br.unitins.armas.dto.OpcaoDTO;
import br.unitins.armas.model.FormaPagamento;
import br.unitins.armas.model.Perfil;
import br.unitins.armas.model.SituacaoAutorizacao;
import br.unitins.armas.model.SituacaoPedido;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

// listas fixas (enums) para os selects do front
@Path("/opcoes")
@Produces(MediaType.APPLICATION_JSON)
public class OpcaoResource {

    @GET
    @Path("/formas-pagamento")
    public List<OpcaoDTO> formasPagamento() {
        return Arrays.stream(FormaPagamento.values()).map(f -> new OpcaoDTO(f.name(), f.getNome())).toList();
    }

    @GET
    @Path("/situacoes-pedido")
    public List<OpcaoDTO> situacoesPedido() {
        return Arrays.stream(SituacaoPedido.values()).map(s -> new OpcaoDTO(s.name(), s.getNome())).toList();
    }

    @GET
    @Path("/situacoes-autorizacao")
    public List<OpcaoDTO> situacoesAutorizacao() {
        return Arrays.stream(SituacaoAutorizacao.values()).map(s -> new OpcaoDTO(s.name(), s.getNome())).toList();
    }

    @GET
    @Path("/perfis")
    public List<OpcaoDTO> perfis() {
        return Arrays.stream(Perfil.values()).map(p -> new OpcaoDTO(p.name(), p.getNome())).toList();
    }
}

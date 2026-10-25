package br.unitins.armas.repository;

import java.util.HashMap;
import java.util.Map;

import br.unitins.armas.model.Pedido;
import br.unitins.armas.model.SituacaoPedido;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PedidoRepository implements PanacheRepository<Pedido> {

    public PanacheQuery<Pedido> buscar(String nomeCliente, SituacaoPedido situacao) {
        StringBuilder consulta = new StringBuilder("1 = 1");
        Map<String, Object> parametros = new HashMap<>();

        if (nomeCliente != null && !nomeCliente.isBlank()) {
            consulta.append(" and lower(cliente.nome) like :nome");
            parametros.put("nome", "%" + nomeCliente.trim().toLowerCase() + "%");
        }

        if (situacao != null) {
            consulta.append(" and situacao = :situacao");
            parametros.put("situacao", situacao);
        }

        consulta.append(" order by data desc, id desc");
        return find(consulta.toString(), parametros);
    }

    public PanacheQuery<Pedido> doCliente(Long idCliente) {
        return find("cliente.id = ?1 order by data desc, id desc", idCliente);
    }

    public boolean existeComCliente(Long idCliente) {
        return count("cliente.id", idCliente) > 0;
    }
}

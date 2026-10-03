package br.unitins.armas.repository;

import java.util.HashMap;
import java.util.Map;

import br.unitins.armas.model.Categoria;
import br.unitins.armas.model.Produto;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProdutoRepository implements PanacheRepository<Produto> {

    public PanacheQuery<Produto> buscar(String nome, Long idMarca, Categoria categoria) {
        StringBuilder consulta = new StringBuilder("1 = 1");
        Map<String, Object> parametros = new HashMap<>();

        if (nome != null && !nome.isBlank()) {
            consulta.append(" and lower(nome) like :nome");
            parametros.put("nome", "%" + nome.trim().toLowerCase() + "%");
        }

        if (idMarca != null) {
            consulta.append(" and marca.id = :idMarca");
            parametros.put("idMarca", idMarca);
        }

        if (categoria != null) {
            consulta.append(" and categoria = :categoria");
            parametros.put("categoria", categoria);
        }

        consulta.append(" order by nome");
        return find(consulta.toString(), parametros);
    }

    public boolean existeComMarca(Long idMarca) {
        return count("marca.id", idMarca) > 0;
    }
}
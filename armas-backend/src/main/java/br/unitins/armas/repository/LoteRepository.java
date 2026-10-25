package br.unitins.armas.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import br.unitins.armas.model.Lote;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class LoteRepository implements PanacheRepository<Lote> {

    // lotes com saldo do produto, do mais antigo para o mais novo
    // (a venda tira primeiro do mais antigo: "primeiro que entra, primeiro que sai")
    public List<Lote> disponiveisDoProduto(Long idProduto) {
        return list("produto.id = ?1 and quantidadeDisponivel > 0 order by dataEntrada, id", idProduto);
    }

    public PanacheQuery<Lote> buscar(String codigo, Long idProduto, Boolean somenteComSaldo) {
        StringBuilder consulta = new StringBuilder("1 = 1");
        Map<String, Object> parametros = new HashMap<>();

        if (codigo != null && !codigo.isBlank()) {
            consulta.append(" and lower(codigo) like :codigo");
            parametros.put("codigo", "%" + codigo.trim().toLowerCase() + "%");
        }

        if (idProduto != null) {
            consulta.append(" and produto.id = :idProduto");
            parametros.put("idProduto", idProduto);
        }

        if (Boolean.TRUE.equals(somenteComSaldo))
            consulta.append(" and quantidadeDisponivel > 0");

        consulta.append(" order by dataEntrada desc, id desc");
        return find(consulta.toString(), parametros);
    }

    public boolean existeCodigo(String codigo) {
        return count("lower(codigo) = ?1", codigo.trim().toLowerCase()) > 0;
    }

    public boolean existeComProduto(Long idProduto) {
        return count("produto.id", idProduto) > 0;
    }
}

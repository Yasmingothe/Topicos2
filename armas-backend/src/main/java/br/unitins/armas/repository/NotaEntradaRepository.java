package br.unitins.armas.repository;

import java.util.HashMap;
import java.util.Map;

import br.unitins.armas.model.NotaEntrada;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class NotaEntradaRepository implements PanacheRepository<NotaEntrada> {

    public PanacheQuery<NotaEntrada> buscar(String numero, Long idFornecedor) {
        StringBuilder consulta = new StringBuilder("1 = 1");
        Map<String, Object> parametros = new HashMap<>();

        if (numero != null && !numero.isBlank()) {
            consulta.append(" and numero like :numero");
            parametros.put("numero", "%" + numero.trim() + "%");
        }

        if (idFornecedor != null) {
            consulta.append(" and fornecedor.id = :idFornecedor");
            parametros.put("idFornecedor", idFornecedor);
        }

        consulta.append(" order by dataEntrada desc, id desc");
        return find(consulta.toString(), parametros);
    }

    public boolean existeNota(String numero, String serie, Long idFornecedor) {
        return count("numero = ?1 and serie = ?2 and fornecedor.id = ?3", numero, serie, idFornecedor) > 0;
    }

    public boolean existeComFornecedor(Long idFornecedor) {
        return count("fornecedor.id", idFornecedor) > 0;
    }
}

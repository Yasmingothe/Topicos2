package br.unitins.armas.repository;

import java.util.HashMap;
import java.util.Map;

import br.unitins.armas.model.Cliente;
import br.unitins.armas.model.SituacaoAutorizacao;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ClienteRepository implements PanacheRepository<Cliente> {

    public PanacheQuery<Cliente> findByNome(String nome) {
        return find("lower(nome) like ?1 order by nome",
                    "%" + nome.trim().toLowerCase() + "%");
    }

    public PanacheQuery<Cliente> findAllOrdenado() {
        return find("order by nome");
    }

    public boolean existeCpf(String cpf, Long idIgnorado) {
        if (idIgnorado == null)
            return count("cpf", cpf) > 0;
        return count("cpf = ?1 and id <> ?2", cpf, idIgnorado) > 0;
    }

    public boolean existeEmail(String email, Long idIgnorado) {
        if (idIgnorado == null)
            return count("lower(email) = ?1", email.toLowerCase()) > 0;
        return count("lower(email) = ?1 and id <> ?2", email.toLowerCase(), idIgnorado) > 0;
    }

    public Cliente findByUsuario(Long idUsuario) {
        return find("usuario.id", idUsuario).firstResult();
    }

    public Cliente findByEmail(String email) {
        return find("lower(email) = ?1", email.trim().toLowerCase()).firstResult();
    }

    public PanacheQuery<Cliente> buscar(String nome, SituacaoAutorizacao situacao) {
        StringBuilder consulta = new StringBuilder("1 = 1");
        Map<String, Object> parametros = new HashMap<>();

        if (nome != null && !nome.isBlank()) {
            consulta.append(" and lower(nome) like :nome");
            parametros.put("nome", "%" + nome.trim().toLowerCase() + "%");
        }

        if (situacao != null) {
            consulta.append(" and situacaoAutorizacao = :situacao");
            parametros.put("situacao", situacao);
        }

        consulta.append(" order by nome");
        return find(consulta.toString(), parametros);
    }
}

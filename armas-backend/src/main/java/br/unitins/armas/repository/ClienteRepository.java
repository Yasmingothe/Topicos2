package br.unitins.armas.repository;

import br.unitins.armas.model.Cliente;
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
}
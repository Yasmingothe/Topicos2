package br.unitins.armas.repository;

import br.unitins.armas.model.Marca;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class MarcaRepository implements PanacheRepository<Marca> {

    public PanacheQuery<Marca> findByNome(String nome) {
        return find("lower(nome) like ?1 order by nome",
                    "%" + nome.toLowerCase() + "%");
    }

    public boolean existeNome(String nome, Long idIgnorado) {
        if (idIgnorado == null)
            return count("lower(nome) = ?1", nome.toLowerCase()) > 0;

        return count("lower(nome) = ?1 and id <> ?2",
                     nome.toLowerCase(), idIgnorado) > 0;
    }

    public PanacheQuery<Marca> findAllOrdenado() {
        return find("order by nome");
    }
}
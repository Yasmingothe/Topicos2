package br.unitins.armas.repository;

import br.unitins.armas.model.Estado;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class EstadoRepository implements PanacheRepository<Estado> {

    public Estado findBySigla(String sigla) {
        return find("upper(sigla) = ?1", sigla.trim().toUpperCase()).firstResult();
    }
}
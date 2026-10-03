package br.unitins.armas.repository;

import br.unitins.armas.model.Municipio;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class MunicipioRepository implements PanacheRepository<Municipio> {

    public Municipio findByNomeEEstado(String nome, Long idEstado) {
        return find("lower(nome) = ?1 and estado.id = ?2",
                    nome.trim().toLowerCase(), idEstado).firstResult();
    }
}
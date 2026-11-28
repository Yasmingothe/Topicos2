package br.unitins.armas.repository;

import br.unitins.armas.model.RecuperacaoSenha;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class RecuperacaoSenhaRepository implements PanacheRepository<RecuperacaoSenha> {

    public RecuperacaoSenha findByToken(String token) {
        return find("token", token).firstResult();
    }
}

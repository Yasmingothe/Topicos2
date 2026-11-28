package br.unitins.armas.repository;

import java.util.HashMap;
import java.util.Map;

import br.unitins.armas.model.Perfil;
import br.unitins.armas.model.Usuario;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UsuarioRepository implements PanacheRepository<Usuario> {

    public Usuario findByKeycloakId(String keycloakId) {
        return find("keycloakId", keycloakId).firstResult();
    }

    public Usuario findByEmail(String email) {
        if (email == null)
            return null;
        return find("lower(email) = ?1", email.trim().toLowerCase()).firstResult();
    }

    public boolean existeEmail(String email, Long idIgnorado) {
        if (idIgnorado == null)
            return count("lower(email) = ?1", email.trim().toLowerCase()) > 0;
        return count("lower(email) = ?1 and id <> ?2", email.trim().toLowerCase(), idIgnorado) > 0;
    }

    public PanacheQuery<Usuario> buscar(String nome, Perfil perfil) {
        StringBuilder consulta = new StringBuilder("1 = 1");
        Map<String, Object> parametros = new HashMap<>();

        if (nome != null && !nome.isBlank()) {
            consulta.append(" and (lower(nome) like :nome or lower(email) like :nome)");
            parametros.put("nome", "%" + nome.trim().toLowerCase() + "%");
        }

        if (perfil != null) {
            consulta.append(" and perfil = :perfil");
            parametros.put("perfil", perfil);
        }

        consulta.append(" order by nome");
        return find(consulta.toString(), parametros);
    }

    public long contarAdminsAtivos() {
        return count("perfil = ?1 and ativo = true", Perfil.ADMIN);
    }
}

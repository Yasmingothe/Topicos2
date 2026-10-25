package br.unitins.armas.repository;

import br.unitins.armas.model.Fornecedor;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class FornecedorRepository implements PanacheRepository<Fornecedor> {

    // busca pelo nome (razão social ou fantasia) ou pelo CNPJ
    public PanacheQuery<Fornecedor> buscar(String texto) {
        if (texto == null || texto.isBlank())
            return find("order by razaoSocial");

        String termo = "%" + texto.trim().toLowerCase() + "%";
        String soNumeros = texto.replaceAll("\\D", "");
        if (soNumeros.isEmpty())
            soNumeros = "-";

        return find("lower(razaoSocial) like ?1 or lower(nomeFantasia) like ?1 or cnpj like ?2 order by razaoSocial",
                    termo, "%" + soNumeros + "%");
    }

    public boolean existeCnpj(String cnpj, Long idIgnorado) {
        if (idIgnorado == null)
            return count("cnpj", cnpj) > 0;
        return count("cnpj = ?1 and id <> ?2", cnpj, idIgnorado) > 0;
    }
}

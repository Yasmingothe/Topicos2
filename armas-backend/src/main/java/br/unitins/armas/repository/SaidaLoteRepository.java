package br.unitins.armas.repository;

import java.util.List;

import br.unitins.armas.model.SaidaLote;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SaidaLoteRepository implements PanacheRepository<SaidaLote> {

    // para onde foram as unidades de um lote (rastreio)
    public List<SaidaLote> doLote(Long idLote) {
        return list("lote.id = ?1 order by itemPedido.pedido.data desc", idLote);
    }

    public boolean existeDoLote(Long idLote) {
        return count("lote.id", idLote) > 0;
    }
}

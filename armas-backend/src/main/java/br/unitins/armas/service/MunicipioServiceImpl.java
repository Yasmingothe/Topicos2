package br.unitins.armas.service;

import br.unitins.armas.exception.CampoInvalidoException;
import br.unitins.armas.model.Estado;
import br.unitins.armas.model.Municipio;
import br.unitins.armas.repository.EstadoRepository;
import br.unitins.armas.repository.MunicipioRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class MunicipioServiceImpl implements MunicipioService {

    @Inject
    MunicipioRepository municipioRepository;

    @Inject
    EstadoRepository estadoRepository;

    @Override
    @Transactional
    public Municipio buscarOuCriar(String nome, String uf) {
        
        Estado estado = estadoRepository.findBySigla(uf);
        if (estado == null)
            throw new CampoInvalidoException("uf", "UF não encontrada.");

        Municipio municipio = municipioRepository.findByNomeEEstado(nome, estado.getId());
        if (municipio != null)
            return municipio; 

        municipio = new Municipio();
        municipio.setNome(nome.trim());
        municipio.setEstado(estado);
        municipioRepository.persist(municipio);
        return municipio;
    }
}
package br.unitins.armas.service;

import br.unitins.armas.model.Municipio;

public interface MunicipioService {

    Municipio buscarOuCriar(String nome, String uf);
}
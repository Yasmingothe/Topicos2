package br.unitins.armas.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class Marca extends EntidadeBase {

    @Column(length = 60, nullable = false, unique = true)
    private String nome;

    @Column(length = 40, nullable = false)
    private String paisOrigem;

    @Column(nullable = false)
    private Boolean ativa = true;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getPaisOrigem() {
        return paisOrigem;
    }

    public void setPaisOrigem(String paisOrigem) {
        this.paisOrigem = paisOrigem;
    }

    public Boolean getAtiva() {
        return ativa;
    }

    public void setAtiva(Boolean ativa) {
        this.ativa = ativa;
    }
}
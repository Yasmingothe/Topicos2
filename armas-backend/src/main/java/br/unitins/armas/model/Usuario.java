package br.unitins.armas.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Entity
public class Usuario extends EntidadeBase {

    @Column(name = "keycloak_id", length = 64, unique = true)
    private String keycloakId;

    @Column(length = 120, nullable = false)
    private String nome;

    // o e-mail e o login
    @Column(length = 120, nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private Perfil perfil;

    @Column(nullable = false)
    private Boolean ativo = true;

    public String getKeycloakId() { return keycloakId; }
    public void setKeycloakId(String keycloakId) { this.keycloakId = keycloakId; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Perfil getPerfil() { return perfil; }
    public void setPerfil(Perfil perfil) { this.perfil = perfil; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}

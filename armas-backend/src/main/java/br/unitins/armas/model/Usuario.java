package br.unitins.armas.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Entity
public class Usuario extends EntidadeBase {

    @Column(length = 120, nullable = false)
    private String nome;

    // o e-mail é o login
    @Column(length = 120, nullable = false, unique = true)
    private String email;

    // id do usuário lá no Keycloak (o "sub" do token).
    // a SENHA não fica no nosso banco: quem guarda e confere é o Keycloak
    @Column(length = 36, unique = true)
    private String keycloakId;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private Perfil perfil;

    @Column(nullable = false)
    private Boolean ativo = true;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getKeycloakId() { return keycloakId; }
    public void setKeycloakId(String keycloakId) { this.keycloakId = keycloakId; }

    public Perfil getPerfil() { return perfil; }
    public void setPerfil(Perfil perfil) { this.perfil = perfil; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}

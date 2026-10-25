package br.unitins.armas.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class Fornecedor extends EntidadeBase {

    @Column(length = 120, nullable = false)
    private String razaoSocial;

    @Column(length = 80)
    private String nomeFantasia;

    @Column(length = 14, nullable = false, unique = true)
    private String cnpj;

    @Column(length = 120)
    private String email;

    @Column(length = 11)
    private String telefone;

    @Column(nullable = false)
    private Boolean ativo = true;

    public String getRazaoSocial() { return razaoSocial; }
    public void setRazaoSocial(String razaoSocial) { this.razaoSocial = razaoSocial; }

    public String getNomeFantasia() { return nomeFantasia; }
    public void setNomeFantasia(String nomeFantasia) { this.nomeFantasia = nomeFantasia; }

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}

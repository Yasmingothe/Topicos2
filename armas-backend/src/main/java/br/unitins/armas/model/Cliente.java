package br.unitins.armas.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity
public class Cliente extends EntidadeBase {

    @Column(length = 120, nullable = false)
    private String nome;

    @Column(length = 120, nullable = false, unique = true)
    private String email;

    @Column(length = 11, nullable = false, unique = true)
    private String cpf;

    @Column(nullable = false)
    private LocalDate dataNascimento;

    @Column(length = 11, nullable = false)
    private String telefone;

    @Column(length = 8, nullable = false)
    private String cep;

    @Column(length = 120, nullable = false)
    private String logradouro;

    @Column(length = 10, nullable = false)
    private String numero;

    @Column(length = 60)
    private String complemento;

    @Column(length = 80, nullable = false)
    private String bairro;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_municipio", nullable = false)
    private Municipio municipio;

    // conta de login do cliente (fica vazio se o admin cadastrou o cliente direto)
    @OneToOne
    @JoinColumn(name = "id_usuario", unique = true)
    private Usuario usuario;

    // ===== autorização de compra (simplificada) =====
    @Column(length = 30)
    private String numeroAutorizacao;

    private LocalDate validadeAutorizacao;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private SituacaoAutorizacao situacaoAutorizacao = SituacaoAutorizacao.NAO_ENVIADA;

    // pode comprar arma/munição = autorização aprovada e dentro da validade
    public boolean autorizacaoValida() {
        return situacaoAutorizacao == SituacaoAutorizacao.APROVADA
                && validadeAutorizacao != null
                && !validadeAutorizacao.isBefore(LocalDate.now());
    }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }

    public String getLogradouro() { return logradouro; }
    public void setLogradouro(String logradouro) { this.logradouro = logradouro; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }

    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }

    public Municipio getMunicipio() { return municipio; }
    public void setMunicipio(Municipio municipio) { this.municipio = municipio; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public String getNumeroAutorizacao() { return numeroAutorizacao; }
    public void setNumeroAutorizacao(String numeroAutorizacao) { this.numeroAutorizacao = numeroAutorizacao; }

    public LocalDate getValidadeAutorizacao() { return validadeAutorizacao; }
    public void setValidadeAutorizacao(LocalDate validadeAutorizacao) { this.validadeAutorizacao = validadeAutorizacao; }

    public SituacaoAutorizacao getSituacaoAutorizacao() { return situacaoAutorizacao; }
    public void setSituacaoAutorizacao(SituacaoAutorizacao situacaoAutorizacao) { this.situacaoAutorizacao = situacaoAutorizacao; }
}

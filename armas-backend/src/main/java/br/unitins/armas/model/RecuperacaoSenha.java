package br.unitins.armas.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

// pedido de "Esqueci minha senha": guarda o código (token) que vai no link do e-mail
@Entity
public class RecuperacaoSenha extends EntidadeBase {

    // código aleatório e impossível de adivinhar que vai no link
    @Column(length = 80, nullable = false, unique = true)
    private String token;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    // depois disso o link não vale mais
    @Column(nullable = false)
    private LocalDateTime expiraEm;

    // cada link só pode ser usado uma vez
    @Column(nullable = false)
    private Boolean usado = false;

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public LocalDateTime getExpiraEm() { return expiraEm; }
    public void setExpiraEm(LocalDateTime expiraEm) { this.expiraEm = expiraEm; }

    public Boolean getUsado() { return usado; }
    public void setUsado(Boolean usado) { this.usado = usado; }
}

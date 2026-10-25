package br.unitins.armas.model;

// quem é o usuário no sistema: ADMIN entra no painel, CLIENTE compra na loja
public enum Perfil {

    ADMIN("Administrador"),
    CLIENTE("Cliente");

    private final String nome;

    Perfil(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }

    public static Perfil buscarPorCodigo(String codigo) {
        for (Perfil perfil : values())
            if (perfil.name().equalsIgnoreCase(codigo))
                return perfil;
        return null;
    }
}

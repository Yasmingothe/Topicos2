package br.unitins.armas.model;

public enum Categoria {

    PISTOLA("Pistolas"),
    REVOLVER("Revólveres"),
    RIFLE_CARABINA("Rifles e Carabinas"),
    ESPINGARDA("Espingardas"),
    ACESSORIO_OPTICA("Acessórios e Óptica"),
    MUNICAO("Munição");

    private final String nome;

    Categoria(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }

    public static Categoria buscarPorCodigo(String codigo) {
        for (Categoria categoria : values())
            if (categoria.name().equalsIgnoreCase(codigo))
                return categoria;
        return null;
    }
}
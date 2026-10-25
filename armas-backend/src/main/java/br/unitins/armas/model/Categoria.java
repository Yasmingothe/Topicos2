package br.unitins.armas.model;

public enum Categoria {

    // controlada = true: precisa de autorização de compra para vender
    PISTOLA("Pistolas", true),
    REVOLVER("Revólveres", true),
    RIFLE_CARABINA("Rifles e Carabinas", true),
    ESPINGARDA("Espingardas", true),
    ACESSORIO_OPTICA("Acessórios e Óptica", false),
    MUNICAO("Munição", true);

    private final String nome;
    private final boolean controlada;

    Categoria(String nome, boolean controlada) {
        this.nome = nome;
        this.controlada = controlada;
    }

    public String getNome() {
        return nome;
    }

    public boolean isControlada() {
        return controlada;
    }

    public static Categoria buscarPorCodigo(String codigo) {
        for (Categoria categoria : values())
            if (categoria.name().equalsIgnoreCase(codigo))
                return categoria;
        return null;
    }
}

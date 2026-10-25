package br.unitins.armas.model;

public enum FormaPagamento {

    PIX("PIX"),
    CARTAO_CREDITO("Cartão de crédito"),
    BOLETO("Boleto");

    private final String nome;

    FormaPagamento(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }

    public static FormaPagamento buscarPorCodigo(String codigo) {
        for (FormaPagamento forma : values())
            if (forma.name().equalsIgnoreCase(codigo))
                return forma;
        return null;
    }
}

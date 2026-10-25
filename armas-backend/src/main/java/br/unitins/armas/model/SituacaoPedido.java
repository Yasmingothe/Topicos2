package br.unitins.armas.model;

public enum SituacaoPedido {

    PAGO("Pago"),
    SEPARANDO("Em separação"),
    PRONTO_RETIRADA("Pronto para retirada"),
    ENTREGUE("Entregue"),
    CANCELADO("Cancelado");

    private final String nome;

    SituacaoPedido(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }

    public static SituacaoPedido buscarPorCodigo(String codigo) {
        for (SituacaoPedido situacao : values())
            if (situacao.name().equalsIgnoreCase(codigo))
                return situacao;
        return null;
    }
}

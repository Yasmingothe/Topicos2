package br.unitins.armas.model;

// situação da autorização de compra do cliente (emitida pela Polícia Federal)
public enum SituacaoAutorizacao {

    NAO_ENVIADA("Não enviada"),
    EM_ANALISE("Em análise"),
    APROVADA("Aprovada"),
    RECUSADA("Recusada");

    private final String nome;

    SituacaoAutorizacao(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }

    public static SituacaoAutorizacao buscarPorCodigo(String codigo) {
        for (SituacaoAutorizacao situacao : values())
            if (situacao.name().equalsIgnoreCase(codigo))
                return situacao;
        return null;
    }
}

package br.unitins.armas.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// o estoque saiu daqui: agora ele só muda pela nota de entrada e pela venda
public record ProdutoRequestDTO(

    @NotBlank(message = "Informe o nome do produto.")
    @Size(min = 2, max = 120, message = "O nome deve ter entre 2 e 120 caracteres.")
    String nome,

    @NotNull(message = "Selecione a marca.")
    Long idMarca,

    @NotBlank(message = "Selecione a categoria.")
    String categoria,

    @Size(max = 30, message = "O calibre deve ter no máximo 30 caracteres.")
    String calibre,

    @NotNull(message = "Informe o preço.")
    @DecimalMin(value = "0.01", message = "O preço deve ser maior que zero.")
    @Digits(integer = 8, fraction = 2, message = "Use no máximo 2 casas decimais no preço.")
    BigDecimal preco,

    @Size(max = 1000, message = "A descrição deve ter no máximo 1000 caracteres.")
    String descricao,

    Boolean publicado,

    // link de uma foto na internet (opcional)
    @Size(max = 500, message = "O link da foto deve ter no máximo 500 caracteres.")
    @Pattern(regexp = "(https?://\\S+)?", message = "O link da foto deve começar com http:// ou https://.")
    String imagemUrl
) {
}

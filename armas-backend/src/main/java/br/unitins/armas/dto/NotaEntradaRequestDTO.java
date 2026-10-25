package br.unitins.armas.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

public record NotaEntradaRequestDTO(

    @NotBlank(message = "Informe o número da nota.")
    @Pattern(regexp = "\\d{1,20}", message = "O número da nota deve ter só números (até 20).")
    String numero,

    @NotBlank(message = "Informe a série.")
    @Size(max = 5, message = "A série deve ter no máximo 5 caracteres.")
    String serie,

    @NotNull(message = "Selecione o fornecedor.")
    Long idFornecedor,

    @NotNull(message = "Informe a data de emissão.")
    @PastOrPresent(message = "A data de emissão não pode ser no futuro.")
    LocalDate dataEmissao,

    @NotNull(message = "Informe a data de entrada.")
    @PastOrPresent(message = "A data de entrada não pode ser no futuro.")
    LocalDate dataEntrada,

    @Size(max = 500, message = "A observação deve ter no máximo 500 caracteres.")
    String observacao,

    @NotEmpty(message = "Adicione pelo menos um produto na nota.")
    List<@Valid ItemNotaEntradaRequestDTO> itens
) {
}

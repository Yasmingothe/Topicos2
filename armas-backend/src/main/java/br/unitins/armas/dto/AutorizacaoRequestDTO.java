package br.unitins.armas.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

// o cliente informa a autorização de compra que já tirou na Polícia Federal
public record AutorizacaoRequestDTO(

    @NotBlank(message = "Informe o número da autorização.")
    @Pattern(regexp = "[A-Za-z0-9./-]{5,30}", message = "Número inválido (de 5 a 30 letras, números, ponto, barra ou traço).")
    String numero,

    @NotNull(message = "Informe a validade.")
    @Future(message = "A autorização está vencida. Informe uma validade futura.")
    LocalDate validade
) {
}

package com.vortex.vortex.modules.manufatura.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CriarOrdemProducaoRequestDTO(
    @NotBlank(message = "A descrição do cliente é obrigatória")
    @Size(max = 150, message = "O cliente não pode exceder 150 caracteres")
    String cliente,

    @NotBlank(message = "A descrição do produto é obrigatória")
    @Size(max = 150, message = "O produto não pode exceder 150 caracteres")
    String produto,

    @NotNull(message = "A quantidade planejada é obrigatória")
    @Min(value = 1, message = "A quantidade mínima é 1")
    Integer quantidade,

    String maquinaNome,

    String material,

    BigDecimal pesoFilamento
) {}

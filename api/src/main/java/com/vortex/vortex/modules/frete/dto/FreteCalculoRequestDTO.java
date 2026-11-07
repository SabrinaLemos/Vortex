package com.vortex.vortex.modules.frete.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

public record FreteCalculoRequestDTO(
    @NotBlank(message = "O CEP de destino é obrigatório")
    @Pattern(regexp = "^\\d{5}-?\\d{3}$", message = "Formato de CEP inválido. Use 00000-000 ou 00000000")
    String cepDestino,

    BigDecimal pesoTotalKg
) {}

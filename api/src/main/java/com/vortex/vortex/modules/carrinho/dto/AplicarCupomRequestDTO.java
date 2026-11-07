package com.vortex.vortex.modules.carrinho.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AplicarCupomRequestDTO(
    @NotBlank(message = "O código do cupom é obrigatório")
    @Size(max = 40, message = "O código do cupom não pode exceder 40 caracteres")
    String codigoCupom
) {}

package com.vortex.vortex.modules.carrinho.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record AdicionarItemCarrinhoRequestDTO(
    @NotNull(message = "O ID do produto é obrigatório")
    UUID produtoId,

    @NotNull(message = "A quantidade é obrigatória")
    @Min(value = 1, message = "A quantidade mínima é 1")
    Integer quantidade,

    @Size(max = 40, message = "O material não pode exceder 40 caracteres")
    String material,

    @Size(max = 40, message = "A cor não pode exceder 40 caracteres")
    String cor,

    @Size(max = 255, message = "O payload NFC não pode exceder 255 caracteres")
    String payloadNfc,

    @Size(max = 50, message = "A gravação laser não pode exceder 50 caracteres")
    String gravacaoLaser,

    UUID arquivoCadId
) {}

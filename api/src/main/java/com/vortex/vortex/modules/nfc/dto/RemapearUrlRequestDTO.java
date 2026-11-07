package com.vortex.vortex.modules.nfc.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RemapearUrlRequestDTO(
    @NotBlank(message = "A URL de destino é obrigatória")
    @Size(max = 500, message = "A URL não pode exceder 500 caracteres")
    String urlDestino,

    @Size(max = 100, message = "O apelido não pode exceder 100 caracteres")
    String apelido
) {}

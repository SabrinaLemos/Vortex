package com.vortex.vortex.modules.nfc.dto;

import com.vortex.vortex.modules.nfc.enums.TipoChipNfc;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CriarTagNfcRequestDTO(
    @NotBlank(message = "O UID é obrigatório")
    @Size(max = 40, message = "O UID não pode exceder 40 caracteres")
    String uid,

    TipoChipNfc tipoChip,

    @Size(max = 100, message = "O apelido não pode exceder 100 caracteres")
    String apelido,

    @Size(max = 100, message = "O slug não pode exceder 100 caracteres")
    String slugRedirecionamento,

    @NotBlank(message = "A URL de destino é obrigatória")
    @Size(max = 500, message = "A URL de destino não pode exceder 500 caracteres")
    String urlDestino,

    UUID usuarioTitularId
) {}

package com.vortex.vortex.modules.nfc.dto;

import java.time.Instant;
import java.util.UUID;

public record TagNfcResponseDTO(
    UUID id,
    String uid,
    String tipoChip,
    String apelido,
    String slugRedirecionamento,
    String urlDestino,
    String lockBitStatus,
    Integer contagemToques,
    Instant ultimoToqueEm,
    Boolean ativo
) {}

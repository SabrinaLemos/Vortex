package com.vortex.vortex.modules.personalizado.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ArquivoProjetoCadResponseDTO(
    UUID id,
    String nomeArquivoOriginal,
    Long tamanhoBytes,
    String extensao,
    BigDecimal volumeCm3,
    String dimensoesBoundingBox,
    String alturaCamada,
    String infill,
    String material,
    String cor,
    Boolean possuiChipNfc,
    String payloadNfc,
    BigDecimal orcamentoEstimado,
    Instant criadoEm
) {}

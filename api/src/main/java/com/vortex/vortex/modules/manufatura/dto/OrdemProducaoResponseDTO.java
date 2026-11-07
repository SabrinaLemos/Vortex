package com.vortex.vortex.modules.manufatura.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record OrdemProducaoResponseDTO(
    UUID id,
    String codigoOs,
    String cliente,
    String produto,
    Integer quantidadePlanejada,
    Integer quantidadeProduzida,
    String maquinaNome,
    String status,
    String materialUtilizado,
    BigDecimal pesoFilamentoEstimadoGramas,
    Instant criadoEm
) {}

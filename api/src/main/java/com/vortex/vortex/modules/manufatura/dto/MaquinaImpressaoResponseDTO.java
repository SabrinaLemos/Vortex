package com.vortex.vortex.modules.manufatura.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record MaquinaImpressaoResponseDTO(
    UUID id,
    String nomeIdentificador,
    String tecnologia,
    String status,
    BigDecimal temperaturaBicoCelsius,
    BigDecimal temperaturaMesaCelsius,
    String nozzleDiametro,
    Integer camadaAtual,
    Integer totalCamadas,
    Integer tempoRestanteMinutos
) {}

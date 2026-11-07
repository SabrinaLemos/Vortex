package com.vortex.vortex.modules.pedido.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TelemetriaRastreioResponseDTO(
    UUID id,
    String codigoRastreio,
    BigDecimal temperaturaCelsius,
    BigDecimal acelerometroGForce,
    Integer bateriaDispositivoPercentual,
    BigDecimal latitude,
    BigDecimal longitude,
    String ultimoHub,
    String descricaoEvento,
    Instant registradoEm
) {}

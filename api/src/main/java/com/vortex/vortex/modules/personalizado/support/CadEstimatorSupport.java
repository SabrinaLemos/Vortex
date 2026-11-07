package com.vortex.vortex.modules.personalizado.support;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class CadEstimatorSupport {

    public BigDecimal calcularOrcamento(String alturaCamada, String material, Boolean possuiChipNfc) {
        BigDecimal base = new BigDecimal("54.90");

        BigDecimal multiplicadorCamada = switch (alturaCamada != null ? alturaCamada : "0.20mm") {
            case "0.12mm" -> new BigDecimal("1.15");
            case "0.28mm" -> new BigDecimal("0.90");
            default -> new BigDecimal("1.00");
        };

        BigDecimal custoBaseAjustado = base.multiply(multiplicadorCamada);

        BigDecimal sobretaxaMaterial = switch (material != null ? material.toUpperCase() : "PLA") {
            case "PETG" -> new BigDecimal("14.00");
            case "CF_ABS", "ABS_CARBON" -> new BigDecimal("38.00");
            case "RESINA", "RESIN" -> new BigDecimal("52.00");
            default -> BigDecimal.ZERO;
        };

        BigDecimal custoNfc = Boolean.TRUE.equals(possuiChipNfc) ? new BigDecimal("18.00") : BigDecimal.ZERO;

        return custoBaseAjustado.add(sobretaxaMaterial).add(custoNfc).setScale(2, RoundingMode.HALF_UP);
    }
}

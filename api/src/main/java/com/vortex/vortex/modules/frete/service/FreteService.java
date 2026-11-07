package com.vortex.vortex.modules.frete.service;

import com.vortex.vortex.modules.frete.dto.FreteCalculoRequestDTO;
import com.vortex.vortex.modules.frete.dto.OpcaoFreteDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FreteService {

    public List<OpcaoFreteDTO> calcularOpcoesFrete(FreteCalculoRequestDTO dto) {
        String cepLimpo = dto.cepDestino().replaceAll("\\D", "");
        BigDecimal peso = dto.pesoTotalKg() != null && dto.pesoTotalKg().compareTo(BigDecimal.ZERO) > 0
            ? dto.pesoTotalKg()
            : new BigDecimal("0.30"); // peso padrão 300g

        // Lógica de cálculo tarifário baseada na região e peso
        boolean isSudeste = cepLimpo.startsWith("0") || cepLimpo.startsWith("1") || cepLimpo.startsWith("2") || cepLimpo.startsWith("3");
        
        BigDecimal baseSedex = isSudeste ? new BigDecimal("14.80") : new BigDecimal("28.90");
        BigDecimal basePac = isSudeste ? new BigDecimal("9.90") : new BigDecimal("18.50");

        BigDecimal adicionalPeso = peso.multiply(new BigDecimal("3.50")).setScale(2, RoundingMode.HALF_UP);

        BigDecimal valorSedex = baseSedex.add(adicionalPeso);
        BigDecimal valorPac = basePac.add(adicionalPeso);

        String prazoSedex = isSudeste ? "1 a 2 dias úteis" : "3 a 5 dias úteis";
        String prazoPac = isSudeste ? "4 a 6 dias úteis" : "7 a 12 dias úteis";

        log.info("Cotação de frete calculada para CEP: {} (Peso: {}kg)", cepLimpo, peso);

        return List.of(
            new OpcaoFreteDTO(
                "SEDEX",
                "Sedex Expresso com Rastreio IoT",
                valorSedex,
                prazoSedex,
                "Envio rápido monitorado por telemetria Vórtex"
            ),
            new OpcaoFreteDTO(
                "PAC",
                "PAC Econômico Correios",
                valorPac,
                prazoPac,
                "Entrega econômica para todo o território nacional"
            ),
            new OpcaoFreteDTO(
                "RETIRADA_LAB",
                "Retirada no Lab Vórtex (São Paulo / Pinheiros)",
                BigDecimal.ZERO,
                "Disponível em 24h após impressão",
                "Sem custo de frete com retirada técnica presencial"
            )
        );
    }
}

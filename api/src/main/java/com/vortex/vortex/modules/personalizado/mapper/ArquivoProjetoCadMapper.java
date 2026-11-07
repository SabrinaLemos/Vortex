package com.vortex.vortex.modules.personalizado.mapper;

import com.vortex.vortex.modules.personalizado.dto.ArquivoProjetoCadResponseDTO;
import com.vortex.vortex.modules.personalizado.entity.ArquivoProjetoCad;
import com.vortex.vortex.modules.usuario.entity.Usuario;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ArquivoProjetoCadMapper {

    public ArquivoProjetoCad toEntity(
        String nomeOriginal,
        Long tamanho,
        String extensao,
        String storagePath,
        String alturaCamada,
        String infill,
        String material,
        String cor,
        Boolean possuiNfc,
        String payloadNfc,
        String briefing,
        BigDecimal orcamento,
        Usuario usuario
    ) {
        return ArquivoProjetoCad.builder()
            .usuario(usuario)
            .nomeArquivoOriginal(nomeOriginal)
            .tamanhoBytes(tamanho)
            .extensao(extensao)
            .storagePath(storagePath)
            .storageProvider("LOCAL")
            .volumeCm3(new BigDecimal("32.50")) // Volume estimado de base
            .dimensoesBoundingBox("65 x 55 x 85 mm")
            .alturaCamadaSolicitada(alturaCamada != null ? alturaCamada : "0.20mm")
            .infillSolicitado(infill != null ? infill : "Giroide")
            .materialSolicitado(material != null ? material : "PLA")
            .corSolicitada(cor != null ? cor : "Laranja Vórtex")
            .possuiChipNfc(Boolean.TRUE.equals(possuiNfc))
            .payloadNfc(payloadNfc)
            .briefingCliente(briefing)
            .orcamentoEstimado(orcamento)
            .build();
    }

    public ArquivoProjetoCadResponseDTO toResponseDTO(ArquivoProjetoCad entity) {
        if (entity == null) return null;
        return new ArquivoProjetoCadResponseDTO(
            entity.getId(),
            entity.getNomeArquivoOriginal(),
            entity.getTamanhoBytes(),
            entity.getExtensao(),
            entity.getVolumeCm3(),
            entity.getDimensoesBoundingBox(),
            entity.getAlturaCamadaSolicitada(),
            entity.getInfillSolicitado(),
            entity.getMaterialSolicitado(),
            entity.getCorSolicitada(),
            entity.getPossuiChipNfc(),
            entity.getPayloadNfc(),
            entity.getOrcamentoEstimado(),
            entity.getCriadoEm()
        );
    }
}

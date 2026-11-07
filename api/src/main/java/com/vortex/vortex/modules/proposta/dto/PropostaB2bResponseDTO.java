package com.vortex.vortex.modules.proposta.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PropostaB2bResponseDTO(
    UUID id,
    String codigoProposta,
    String nomeResponsavel,
    String empresa,
    String cnpj,
    String email,
    String telefone,
    String modalidade,
    String volumeEstimado,
    String descricaoProjeto,
    Boolean incluiChipNfc,
    Boolean incluiGravacaoLaser,
    String status,
    BigDecimal valorTotalEstimado,
    Integer prazoDiasEstimado,
    String engenheiroResponsavel,
    Instant criadoEm
) {}

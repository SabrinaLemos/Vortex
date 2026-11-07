package com.vortex.vortex.modules.frete.dto;

import java.math.BigDecimal;

public record OpcaoFreteDTO(
    String modalidade,
    String nome,
    BigDecimal valor,
    String prazoEstimado,
    String descricao
) {}

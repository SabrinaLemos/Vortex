package com.vortex.vortex.modules.manufatura.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record EstoqueInsumoResponseDTO(
    UUID id,
    String sku,
    String nome,
    String categoriaInsumo,
    String cor,
    BigDecimal pesoLiquidoGramasTotal,
    Integer quantidadeUnidades,
    BigDecimal estoqueMinimoAlerta,
    String fornecedor,
    Boolean estoqueBaixo
) {}

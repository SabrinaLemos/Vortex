package com.vortex.vortex.modules.produto.dto;

import java.math.BigDecimal;

public record ProdutoFiltroRequestDTO(
    String categoria,
    String tecnologia,
    BigDecimal precoMaximo,
    String busca,
    Boolean apenasNfc,
    Boolean destaque
) {}

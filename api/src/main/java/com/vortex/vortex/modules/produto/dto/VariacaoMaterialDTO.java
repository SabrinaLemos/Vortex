package com.vortex.vortex.modules.produto.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record VariacaoMaterialDTO(
    UUID id,
    String chaveMaterial,
    String nomeExibicao,
    BigDecimal acrescimoPreco,
    String descricaoTecnica
) {}

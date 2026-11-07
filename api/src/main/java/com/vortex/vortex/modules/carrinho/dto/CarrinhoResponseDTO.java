package com.vortex.vortex.modules.carrinho.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CarrinhoResponseDTO(
    UUID id,
    List<ItemCarrinhoResponseDTO> itens,
    Integer totalItens,
    BigDecimal subtotal,
    BigDecimal descontoVolume,
    BigDecimal descontoCupom,
    BigDecimal total,
    String cupomAplicado
) {}

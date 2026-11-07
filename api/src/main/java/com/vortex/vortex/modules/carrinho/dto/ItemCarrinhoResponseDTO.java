package com.vortex.vortex.modules.carrinho.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ItemCarrinhoResponseDTO(
    UUID id,
    UUID produtoId,
    String titulo,
    String sku,
    String imagemUrl,
    Integer quantidade,
    String material,
    String cor,
    String payloadNfc,
    String gravacaoLaser,
    BigDecimal precoUnitario,
    BigDecimal precoTotal
) {}

package com.vortex.vortex.modules.pedido.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ItemPedidoResponseDTO(
    UUID id,
    String titulo,
    String sku,
    String material,
    String cor,
    String payloadNfc,
    String gravacaoLaser,
    Integer quantidade,
    BigDecimal precoUnitario,
    BigDecimal precoTotal
) {}

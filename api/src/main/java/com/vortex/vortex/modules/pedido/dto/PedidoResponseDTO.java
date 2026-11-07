package com.vortex.vortex.modules.pedido.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record PedidoResponseDTO(
    UUID id,
    String codigoOrdem,
    String status,
    String statusPagamento,
    BigDecimal subtotal,
    BigDecimal desconto,
    BigDecimal valorFrete,
    BigDecimal total,
    String metodoPagamento,
    Integer parcelas,
    String qrCodePix,
    String qrCodePixUrl,
    String modalidadeFrete,
    String prazoEstimadoEntrega,
    String observacoesProducao,
    List<ItemPedidoResponseDTO> itens,
    List<TelemetriaRastreioResponseDTO> rastreio,
    Instant criadoEm
) {}

package com.vortex.vortex.modules.pedido.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MercadoPagoWebhookDTO(
    String action,
    String type,
    @JsonProperty("data") WebhookData data
) {
    public record WebhookData(String id) {}
}

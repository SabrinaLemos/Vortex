package com.vortex.vortex.modules.pedido.dto;

public record DadosCartaoDTO(
    String numero,
    String titular,
    String expira,
    String cvv,
    Integer parcelas
) {}

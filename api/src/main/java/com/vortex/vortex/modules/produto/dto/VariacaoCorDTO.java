package com.vortex.vortex.modules.produto.dto;

import java.util.UUID;

public record VariacaoCorDTO(
    UUID id,
    String nomeCor,
    String codigoHex
) {}

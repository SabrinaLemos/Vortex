package com.vortex.vortex.modules.manufatura.dto;

import com.vortex.vortex.modules.manufatura.enums.StatusOrdemProducao;
import jakarta.validation.constraints.NotNull;

public record AtualizarStatusOrdemRequestDTO(
    @NotNull(message = "O novo status da ordem é obrigatório")
    StatusOrdemProducao status,

    Integer quantidadeProduzida
) {}

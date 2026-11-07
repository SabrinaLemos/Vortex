package com.vortex.vortex.modules.manufatura.dto;

import java.math.BigDecimal;

public record AdminDashboardDTO(
    long ordensAtivas,
    long maquinasEmOperacao,
    long totalMaquinas,
    long produtosCadastrados,
    long totalClientes,
    BigDecimal faturamentoTotal
) {}

package com.vortex.vortex.modules.pedido.dto;

import com.vortex.vortex.modules.pedido.enums.MetodoPagamento;
import com.vortex.vortex.modules.pedido.enums.ModalidadeFrete;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.UUID;

public record CriarPedidoRequestDTO(
    UUID enderecoEntregaId,

    @NotNull(message = "A modalidade de frete é obrigatória")
    ModalidadeFrete modalidadeFrete,

    @NotNull(message = "O valor do frete é obrigatório")
    @PositiveOrZero(message = "O valor do frete não pode ser negativo")
    BigDecimal valorFrete,

    @NotNull(message = "O método de pagamento é obrigatório")
    MetodoPagamento metodoPagamento,

    Integer parcelas,

    DadosCartaoDTO dadosCartao,

    @Size(max = 1000, message = "Observações de produção não podem exceder 1000 caracteres")
    String observacoesProducao
) {}

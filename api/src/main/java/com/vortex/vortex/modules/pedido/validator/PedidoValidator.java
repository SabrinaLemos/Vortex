package com.vortex.vortex.modules.pedido.validator;

import com.vortex.vortex.common.exception.BadRequestException;
import com.vortex.vortex.modules.carrinho.entity.Carrinho;
import com.vortex.vortex.modules.pedido.enums.MetodoPagamento;
import com.vortex.vortex.modules.usuario.entity.Usuario;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class PedidoValidator {

    public void validarCarrinhoParaCheckout(Carrinho carrinho) {
        if (carrinho.getItens() == null || carrinho.getItens().isEmpty()) {
            throw new BadRequestException("O carrinho de compras está vazio. Adicione produtos antes de finalizar o pedido.");
        }
    }

    public void validarCreditoB2B(Usuario usuario, MetodoPagamento metodoPagamento, BigDecimal valorTotal) {
        if (metodoPagamento == MetodoPagamento.FATURAMENTO_B2B) {
            BigDecimal limite = usuario.getLimiteCreditoB2b() != null ? usuario.getLimiteCreditoB2b() : BigDecimal.ZERO;
            if (limite.compareTo(valorTotal) < 0) {
                throw new BadRequestException(String.format(
                    "Limite de faturamento B2B insuficiente. Limite disponível: R$ %.2f (Total do pedido: R$ %.2f)",
                    limite, valorTotal
                ));
            }
        }
    }
}

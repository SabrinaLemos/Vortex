package com.vortex.vortex.modules.carrinho.validator;

import com.vortex.vortex.common.exception.BadRequestException;
import com.vortex.vortex.modules.carrinho.entity.CupomDesconto;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;

@Component
public class CupomValidator {

    public void validarAplicabilidade(CupomDesconto cupom, BigDecimal subtotalCarrinho) {
        if (!Boolean.TRUE.equals(cupom.getAtivo())) {
            throw new BadRequestException("O cupom de desconto informado está inativo.");
        }

        if (cupom.getValidoAte() != null && cupom.getValidoAte().isBefore(Instant.now())) {
            throw new BadRequestException("O cupom de desconto informado expirou.");
        }

        if (cupom.getLimiteUsos() != null && cupom.getTotalUtilizado() >= cupom.getLimiteUsos()) {
            throw new BadRequestException("O limite de utilização deste cupom de desconto foi atingido.");
        }

        if (cupom.getValorMinimoPedido() != null && subtotalCarrinho.compareTo(cupom.getValorMinimoPedido()) < 0) {
            throw new BadRequestException(String.format(
                "O valor mínimo do carrinho para este cupom é de R$ %.2f",
                cupom.getValorMinimoPedido()
            ));
        }
    }
}

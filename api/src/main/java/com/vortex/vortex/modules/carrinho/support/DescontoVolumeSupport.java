package com.vortex.vortex.modules.carrinho.support;

import com.vortex.vortex.modules.carrinho.entity.CupomDesconto;
import com.vortex.vortex.modules.carrinho.entity.ItemCarrinho;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Component
public class DescontoVolumeSupport {

    public BigDecimal calcularDescontoVolume(List<ItemCarrinho> itens) {
        if (itens == null || itens.isEmpty()) return BigDecimal.ZERO;

        BigDecimal totalDesconto = BigDecimal.ZERO;

        for (ItemCarrinho item : itens) {
            int qty = item.getQuantidade();
            BigDecimal taxa = BigDecimal.ZERO;

            if (qty >= 50) {
                taxa = new BigDecimal("0.20"); // 20%
            } else if (qty >= 10) {
                taxa = new BigDecimal("0.10"); // 10%
            } else if (qty >= 5) {
                taxa = new BigDecimal("0.05"); // 5%
            }

            if (taxa.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal valorBruto = item.getPrecoUnitarioMomento().multiply(BigDecimal.valueOf(qty));
                BigDecimal descItem = valorBruto.multiply(taxa);
                totalDesconto = totalDesconto.add(descItem);
            }
        }

        return totalDesconto.setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calcularDescontoCupom(CupomDesconto cupom, BigDecimal subtotalLiquido) {
        if (cupom == null || subtotalLiquido.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        return switch (cupom.getTipo()) {
            case PERCENTUAL -> {
                BigDecimal fator = cupom.getValor().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
                yield subtotalLiquido.multiply(fator).setScale(2, RoundingMode.HALF_UP);
            }
            case VALOR_FIXO -> cupom.getValor().min(subtotalLiquido).setScale(2, RoundingMode.HALF_UP);
            case FRETE_GRATIS -> BigDecimal.ZERO; // Tratado na etapa de frete
        };
    }
}

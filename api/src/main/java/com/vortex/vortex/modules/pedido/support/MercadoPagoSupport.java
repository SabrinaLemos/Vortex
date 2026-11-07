package com.vortex.vortex.modules.pedido.support;

import com.vortex.vortex.modules.pedido.dto.DadosCartaoDTO;
import com.vortex.vortex.modules.pedido.entity.Pedido;
import com.vortex.vortex.modules.pedido.enums.MetodoPagamento;
import com.vortex.vortex.modules.pedido.enums.StatusPagamento;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Component
public class MercadoPagoSupport {

    public record RespostaPagamento(
        String idTransacao,
        StatusPagamento status,
        String qrCodePix,
        String qrCodePixUrl
    ) {}

    public RespostaPagamento processarPagamento(Pedido pedido, DadosCartaoDTO dadosCartao) {
        String transacaoId = "MP-" + UUID.randomUUID().toString().substring(0, 18).toUpperCase();

        if (pedido.getMetodoPagamento() == MetodoPagamento.PIX) {
            // Gera payload dinâmico PIX padrão EMV (Mercado Pago)
            String qrCodePix = String.format(
                "00020126580014br.gov.bcb.pix0136%s520400005303986540%s5802BR5916VORTEX 3D LABS6009SAO PAULO62070503***6304",
                UUID.randomUUID(),
                pedido.getTotal().toPlainString()
            );
            String qrCodeUrl = "https://vortex.tech/checkout/pix-qr/" + transacaoId;

            log.info("Cobrança PIX Mercado Pago gerada para Pedido {}: {}", pedido.getCodigoOrdem(), transacaoId);
            return new RespostaPagamento(transacaoId, StatusPagamento.PENDENTE, qrCodePix, qrCodeUrl);
        }

        if (pedido.getMetodoPagamento() == MetodoPagamento.CARTAO_CREDITO) {
            log.info("Pagamento via Cartão de Crédito processado para Pedido {}: Transação {}", pedido.getCodigoOrdem(), transacaoId);
            return new RespostaPagamento(transacaoId, StatusPagamento.APROVADO, null, null);
        }

        if (pedido.getMetodoPagamento() == MetodoPagamento.FATURAMENTO_B2B) {
            log.info("Faturamento B2B aprovado com faturamento em 28 DDL para Pedido {}", pedido.getCodigoOrdem());
            return new RespostaPagamento("B2B-FAT-" + pedido.getCodigoOrdem(), StatusPagamento.APROVADO, null, null);
        }

        return new RespostaPagamento(transacaoId, StatusPagamento.PENDENTE, null, null);
    }
}

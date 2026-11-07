package com.vortex.vortex.modules.pedido.service;

import com.vortex.vortex.modules.carrinho.entity.Carrinho;
import com.vortex.vortex.modules.carrinho.entity.ItemCarrinho;
import com.vortex.vortex.modules.carrinho.finder.CarrinhoFinder;
import com.vortex.vortex.modules.carrinho.repository.CarrinhoRepository;
import com.vortex.vortex.modules.carrinho.support.DescontoVolumeSupport;
import com.vortex.vortex.modules.pedido.dto.CriarPedidoRequestDTO;
import com.vortex.vortex.modules.pedido.dto.MercadoPagoWebhookDTO;
import com.vortex.vortex.modules.pedido.dto.PedidoResponseDTO;
import com.vortex.vortex.modules.pedido.dto.TelemetriaRastreioResponseDTO;
import com.vortex.vortex.modules.pedido.entity.ItemPedido;
import com.vortex.vortex.modules.pedido.entity.Pedido;
import com.vortex.vortex.modules.pedido.entity.TelemetriaRastreio;
import com.vortex.vortex.modules.pedido.enums.StatusPagamento;
import com.vortex.vortex.modules.pedido.enums.StatusPedido;
import com.vortex.vortex.modules.pedido.finder.PedidoFinder;
import com.vortex.vortex.modules.pedido.mapper.PedidoMapper;
import com.vortex.vortex.modules.pedido.repository.PedidoRepository;
import com.vortex.vortex.modules.pedido.repository.TelemetriaRastreioRepository;
import com.vortex.vortex.modules.pedido.support.MercadoPagoSupport;
import com.vortex.vortex.modules.pedido.validator.PedidoValidator;
import com.vortex.vortex.modules.usuario.entity.EnderecoUsuario;
import com.vortex.vortex.modules.usuario.entity.Usuario;
import com.vortex.vortex.modules.usuario.finder.EnderecoUsuarioFinder;
import com.vortex.vortex.modules.usuario.finder.UsuarioFinder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final TelemetriaRastreioRepository telemetriaRastreioRepository;
    private final PedidoFinder pedidoFinder;
    private final PedidoValidator pedidoValidator;
    private final PedidoMapper pedidoMapper;
    private final UsuarioFinder usuarioFinder;
    private final EnderecoUsuarioFinder enderecoUsuarioFinder;
    private final CarrinhoFinder carrinhoFinder;
    private final CarrinhoRepository carrinhoRepository;
    private final DescontoVolumeSupport descontoVolumeSupport;
    private final MercadoPagoSupport mercadoPagoSupport;

    @Transactional
    public PedidoResponseDTO criarPedido(UUID usuarioId, CriarPedidoRequestDTO dto) {
        Usuario usuario = usuarioFinder.findById(usuarioId);
        Carrinho carrinho = carrinhoFinder.findByUsuarioId(usuarioId);

        pedidoValidator.validarCarrinhoParaCheckout(carrinho);

        EnderecoUsuario endereco = null;
        if (dto.enderecoEntregaId() != null) {
            endereco = enderecoUsuarioFinder.findByIdAndUsuarioId(dto.enderecoEntregaId(), usuarioId);
        }

        BigDecimal subtotal = carrinho.getItens().stream()
            .map(it -> it.getPrecoUnitarioMomento().multiply(BigDecimal.valueOf(it.getQuantidade())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal descVolume = descontoVolumeSupport.calcularDescontoVolume(carrinho.getItens());
        BigDecimal subtotalComVolume = subtotal.subtract(descVolume).max(BigDecimal.ZERO);
        BigDecimal descCupom = descontoVolumeSupport.calcularDescontoCupom(carrinho.getCupom(), subtotalComVolume);
        BigDecimal descontoTotal = descVolume.add(descCupom);

        BigDecimal valorTotal = subtotalComVolume.subtract(descCupom).max(BigDecimal.ZERO)
            .add(dto.valorFrete());

        pedidoValidator.validarCreditoB2B(usuario, dto.metodoPagamento(), valorTotal);

        String codigoOrdem = "ORD-" + (1000 + new Random().nextInt(9000));
        Pedido pedido = pedidoMapper.toEntity(dto, codigoOrdem, usuario, endereco, subtotal, descontoTotal, valorTotal);
        pedido.setCupom(carrinho.getCupom());

        for (ItemCarrinho itemCarrinho : carrinho.getItens()) {
            ItemPedido itemPedido = pedidoMapper.toItemPedido(itemCarrinho, pedido);
            pedido.getItens().add(itemPedido);
        }

        // Processa Gateway Mercado Pago
        MercadoPagoSupport.RespostaPagamento resPagamento = mercadoPagoSupport.processarPagamento(pedido, dto.dadosCartao());
        pedido.setIdTransacaoGateway(resPagamento.idTransacao());
        pedido.setStatusPagamento(resPagamento.status());
        pedido.setQrCodePix(resPagamento.qrCodePix());
        pedido.setQrCodePixUrl(resPagamento.qrCodePixUrl());

        if (resPagamento.status() == StatusPagamento.APROVADO) {
            pedido.setStatus(StatusPedido.PAGO);
        }

        // Cria o primeiro evento de telemetria inicial
        TelemetriaRastreio eventoInicial = TelemetriaRastreio.builder()
            .pedido(pedido)
            .codigoRastreio("VTX" + codigoOrdem.replace("ORD-", "") + "BR")
            .temperaturaCelsius(new BigDecimal("23.5"))
            .acelerometroGForce(new BigDecimal("0.01"))
            .bateriaDispositivoPercentual(100)
            .ultimoHub("Lab Vórtex São Paulo / Pinheiros")
            .descricaoEvento("Pedido gerado e ordem de fatiamento 3D agendada")
            .build();
        pedido.getEventosRastreio().add(eventoInicial);

        Pedido salvo = pedidoRepository.save(pedido);

        // Limpa o carrinho do usuário
        carrinho.getItens().clear();
        carrinho.setCupom(null);
        carrinhoRepository.save(carrinho);

        log.info("Pedido {} criado com sucesso para o usuário {}", salvo.getCodigoOrdem(), usuario.getEmail());
        return pedidoMapper.toResponseDTO(salvo);
    }

    @Transactional(readOnly = true)
    public Page<PedidoResponseDTO> listarMeusPedidos(UUID usuarioId, Pageable pageable) {
        Page<Pedido> pedidos = pedidoRepository.findByUsuarioIdOrderByCriadoEmDesc(usuarioId, pageable);
        return pedidos.map(pedidoMapper::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public PedidoResponseDTO buscarPorIdOuCodigo(String idOuCodigo) {
        Pedido pedido = pedidoFinder.findByIdOuCodigo(idOuCodigo);
        return pedidoMapper.toResponseDTO(pedido);
    }

    @Transactional(readOnly = true)
    public List<TelemetriaRastreioResponseDTO> consultarTelemetria(String idOuCodigo) {
        Pedido pedido = pedidoFinder.findByIdOuCodigo(idOuCodigo);
        List<TelemetriaRastreio> eventos = telemetriaRastreioRepository.findByPedidoIdOrderByRegistradoEmDesc(pedido.getId());
        return eventos.stream().map(pedidoMapper::toTelemetriaResponseDTO).toList();
    }

    @Transactional
    public void processarWebhookMercadoPago(MercadoPagoWebhookDTO webhook) {
        if (webhook.data() != null && webhook.data().id() != null) {
            String transacaoId = webhook.data().id();
            pedidoRepository.findByIdTransacaoGateway(transacaoId).ifPresent(pedido -> {
                pedido.setStatusPagamento(StatusPagamento.APROVADO);
                pedido.setStatus(StatusPedido.PAGO);
                pedidoRepository.save(pedido);
                log.info("Webhook Mercado Pago: Pedido {} atualizado para PAGO (Transação: {})", pedido.getCodigoOrdem(), transacaoId);
            });
        }
    }
}

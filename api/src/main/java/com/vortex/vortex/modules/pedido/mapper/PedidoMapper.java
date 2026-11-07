package com.vortex.vortex.modules.pedido.mapper;

import com.vortex.vortex.modules.carrinho.entity.ItemCarrinho;
import com.vortex.vortex.modules.pedido.dto.CriarPedidoRequestDTO;
import com.vortex.vortex.modules.pedido.dto.ItemPedidoResponseDTO;
import com.vortex.vortex.modules.pedido.dto.PedidoResponseDTO;
import com.vortex.vortex.modules.pedido.dto.TelemetriaRastreioResponseDTO;
import com.vortex.vortex.modules.pedido.entity.ItemPedido;
import com.vortex.vortex.modules.pedido.entity.Pedido;
import com.vortex.vortex.modules.pedido.entity.TelemetriaRastreio;
import com.vortex.vortex.modules.usuario.entity.EnderecoUsuario;
import com.vortex.vortex.modules.usuario.entity.Usuario;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class PedidoMapper {

    public Pedido toEntity(
        CriarPedidoRequestDTO dto,
        String codigoOrdem,
        Usuario usuario,
        EnderecoUsuario endereco,
        BigDecimal subtotal,
        BigDecimal desconto,
        BigDecimal total
    ) {
        return Pedido.builder()
            .codigoOrdem(codigoOrdem)
            .usuario(usuario)
            .enderecoEntrega(endereco)
            .subtotal(subtotal)
            .desconto(desconto)
            .valorFrete(dto.valorFrete())
            .total(total)
            .metodoPagamento(dto.metodoPagamento())
            .parcelas(dto.parcelas() != null ? dto.parcelas() : 1)
            .modalidadeFrete(dto.modalidadeFrete())
            .observacoesProducao(dto.observacoesProducao())
            .prazoEstimadoEntrega("2 a 5 dias úteis")
            .build();
    }

    public ItemPedido toItemPedido(ItemCarrinho itemCarrinho, Pedido pedido) {
        BigDecimal totalItem = itemCarrinho.getPrecoUnitarioMomento()
            .multiply(BigDecimal.valueOf(itemCarrinho.getQuantidade()));

        return ItemPedido.builder()
            .pedido(pedido)
            .produto(itemCarrinho.getProduto())
            .tituloSnapshot(itemCarrinho.getProduto() != null ? itemCarrinho.getProduto().getTitulo() : "Projeto Customizado")
            .skuSnapshot(itemCarrinho.getProduto() != null ? itemCarrinho.getProduto().getSku() : "VTX-CUSTOM")
            .material(itemCarrinho.getMaterialSelecionado())
            .cor(itemCarrinho.getCorSelecionada())
            .payloadNfc(itemCarrinho.getPayloadNfc())
            .gravacaoLaser(itemCarrinho.getGravacaoLaser())
            .arquivoCadId(itemCarrinho.getArquivoCadId())
            .quantidade(itemCarrinho.getQuantidade())
            .precoUnitario(itemCarrinho.getPrecoUnitarioMomento())
            .precoTotal(totalItem)
            .build();
    }

    public ItemPedidoResponseDTO toItemResponseDTO(ItemPedido item) {
        if (item == null) return null;
        return new ItemPedidoResponseDTO(
            item.getId(),
            item.getTituloSnapshot(),
            item.getSkuSnapshot(),
            item.getMaterial(),
            item.getCor(),
            item.getPayloadNfc(),
            item.getGravacaoLaser(),
            item.getQuantidade(),
            item.getPrecoUnitario(),
            item.getPrecoTotal()
        );
    }

    public TelemetriaRastreioResponseDTO toTelemetriaResponseDTO(TelemetriaRastreio rastreio) {
        if (rastreio == null) return null;
        return new TelemetriaRastreioResponseDTO(
            rastreio.getId(),
            rastreio.getCodigoRastreio(),
            rastreio.getTemperaturaCelsius(),
            rastreio.getAcelerometroGForce(),
            rastreio.getBateriaDispositivoPercentual(),
            rastreio.getLatitude(),
            rastreio.getLongitude(),
            rastreio.getUltimoHub(),
            rastreio.getDescricaoEvento(),
            rastreio.getRegistradoEm()
        );
    }

    public PedidoResponseDTO toResponseDTO(Pedido pedido) {
        if (pedido == null) return null;

        List<ItemPedidoResponseDTO> itens = pedido.getItens() != null
            ? pedido.getItens().stream().map(this::toItemResponseDTO).toList()
            : List.of();

        List<TelemetriaRastreioResponseDTO> rastreio = pedido.getEventosRastreio() != null
            ? pedido.getEventosRastreio().stream().map(this::toTelemetriaResponseDTO).toList()
            : List.of();

        return new PedidoResponseDTO(
            pedido.getId(),
            pedido.getCodigoOrdem(),
            pedido.getStatus().name(),
            pedido.getStatusPagamento().name(),
            pedido.getSubtotal(),
            pedido.getDesconto(),
            pedido.getValorFrete(),
            pedido.getTotal(),
            pedido.getMetodoPagamento().name(),
            pedido.getParcelas(),
            pedido.getQrCodePix(),
            pedido.getQrCodePixUrl(),
            pedido.getModalidadeFrete().name(),
            pedido.getPrazoEstimadoEntrega(),
            pedido.getObservacoesProducao(),
            itens,
            rastreio,
            pedido.getCriadoEm()
        );
    }
}

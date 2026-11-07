package com.vortex.vortex.modules.carrinho.mapper;

import com.vortex.vortex.modules.carrinho.dto.AdicionarItemCarrinhoRequestDTO;
import com.vortex.vortex.modules.carrinho.dto.CarrinhoResponseDTO;
import com.vortex.vortex.modules.carrinho.dto.ItemCarrinhoResponseDTO;
import com.vortex.vortex.modules.carrinho.entity.Carrinho;
import com.vortex.vortex.modules.carrinho.entity.ItemCarrinho;
import com.vortex.vortex.modules.carrinho.support.DescontoVolumeSupport;
import com.vortex.vortex.modules.produto.entity.Produto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CarrinhoMapper {

    private final DescontoVolumeSupport descontoVolumeSupport;

    public ItemCarrinho toEntity(AdicionarItemCarrinhoRequestDTO dto, Carrinho carrinho, Produto produto, BigDecimal precoUnitario) {
        if (dto == null) return null;
        return ItemCarrinho.builder()
            .carrinho(carrinho)
            .produto(produto)
            .quantidade(dto.quantidade())
            .materialSelecionado(dto.material() != null ? dto.material() : "PLA")
            .corSelecionada(dto.cor() != null ? dto.cor() : "Padrão")
            .payloadNfc(dto.payloadNfc())
            .gravacaoLaser(dto.gravacaoLaser())
            .arquivoCadId(dto.arquivoCadId())
            .precoUnitarioMomento(precoUnitario)
            .build();
    }

    public ItemCarrinhoResponseDTO toItemDTO(ItemCarrinho item) {
        if (item == null) return null;

        BigDecimal precoTotal = item.getPrecoUnitarioMomento()
            .multiply(BigDecimal.valueOf(item.getQuantidade()));

        return new ItemCarrinhoResponseDTO(
            item.getId(),
            item.getProduto() != null ? item.getProduto().getId() : null,
            item.getProduto() != null ? item.getProduto().getTitulo() : "Projeto Customizado",
            item.getProduto() != null ? item.getProduto().getSku() : "VTX-CUSTOM",
            item.getProduto() != null ? item.getProduto().getImagemPrincipalUrl() : null,
            item.getQuantidade(),
            item.getMaterialSelecionado(),
            item.getCorSelecionada(),
            item.getPayloadNfc(),
            item.getGravacaoLaser(),
            item.getPrecoUnitarioMomento(),
            precoTotal
        );
    }

    public CarrinhoResponseDTO toResponseDTO(Carrinho carrinho) {
        if (carrinho == null) return null;

        List<ItemCarrinhoResponseDTO> itensDTO = carrinho.getItens() != null
            ? carrinho.getItens().stream().map(this::toItemDTO).toList()
            : List.of();

        int totalItens = carrinho.getItens() != null
            ? carrinho.getItens().stream().mapToInt(ItemCarrinho::getQuantidade).sum()
            : 0;

        BigDecimal subtotal = carrinho.getItens() != null
            ? carrinho.getItens().stream()
                .map(it -> it.getPrecoUnitarioMomento().multiply(BigDecimal.valueOf(it.getQuantidade())))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
            : BigDecimal.ZERO;

        BigDecimal descVolume = descontoVolumeSupport.calcularDescontoVolume(carrinho.getItens());
        BigDecimal subtotalComVolume = subtotal.subtract(descVolume).max(BigDecimal.ZERO);
        BigDecimal descCupom = descontoVolumeSupport.calcularDescontoCupom(carrinho.getCupom(), subtotalComVolume);
        BigDecimal total = subtotalComVolume.subtract(descCupom).max(BigDecimal.ZERO);

        String cupomCodigo = carrinho.getCupom() != null ? carrinho.getCupom().getCodigo() : null;

        return new CarrinhoResponseDTO(
            carrinho.getId(),
            itensDTO,
            totalItens,
            subtotal,
            descVolume,
            descCupom,
            total,
            cupomCodigo
        );
    }
}

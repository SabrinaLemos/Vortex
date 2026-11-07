package com.vortex.vortex.modules.carrinho.service;

import com.vortex.vortex.modules.carrinho.dto.AdicionarItemCarrinhoRequestDTO;
import com.vortex.vortex.modules.carrinho.dto.AplicarCupomRequestDTO;
import com.vortex.vortex.modules.carrinho.dto.AtualizarQuantidadeItemRequestDTO;
import com.vortex.vortex.modules.carrinho.dto.CarrinhoResponseDTO;
import com.vortex.vortex.modules.carrinho.entity.Carrinho;
import com.vortex.vortex.modules.carrinho.entity.CupomDesconto;
import com.vortex.vortex.modules.carrinho.entity.ItemCarrinho;
import com.vortex.vortex.modules.carrinho.finder.CupomDescontoFinder;
import com.vortex.vortex.modules.carrinho.mapper.CarrinhoMapper;
import com.vortex.vortex.modules.carrinho.repository.CarrinhoRepository;
import com.vortex.vortex.modules.carrinho.repository.ItemCarrinhoRepository;
import com.vortex.vortex.modules.carrinho.validator.CupomValidator;
import com.vortex.vortex.modules.produto.entity.Produto;
import com.vortex.vortex.modules.produto.finder.ProdutoFinder;
import com.vortex.vortex.modules.usuario.entity.Usuario;
import com.vortex.vortex.modules.usuario.finder.UsuarioFinder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CarrinhoService {

    private final CarrinhoRepository carrinhoRepository;
    private final ItemCarrinhoRepository itemCarrinhoRepository;
    private final CarrinhoMapper carrinhoMapper;
    private final CupomValidator cupomValidator;
    private final CupomDescontoFinder cupomDescontoFinder;
    private final UsuarioFinder usuarioFinder;
    private final ProdutoFinder produtoFinder;

    @Transactional
    public Carrinho obterOuCriarCarrinho(UUID usuarioId, String tokenSessao) {
        if (usuarioId != null) {
            return carrinhoRepository.findByUsuarioId(usuarioId).orElseGet(() -> {
                Usuario usuario = usuarioFinder.findById(usuarioId);
                Carrinho novo = Carrinho.builder().usuario(usuario).build();
                return carrinhoRepository.save(novo);
            });
        }

        String token = (tokenSessao != null && !tokenSessao.isBlank())
            ? tokenSessao
            : UUID.randomUUID().toString();

        return carrinhoRepository.findByTokenSessao(token).orElseGet(() -> {
            Carrinho novo = Carrinho.builder().tokenSessao(token).build();
            return carrinhoRepository.save(novo);
        });
    }

    @Transactional
    public CarrinhoResponseDTO consultarCarrinho(UUID usuarioId, String tokenSessao) {
        Carrinho carrinho = obterOuCriarCarrinho(usuarioId, tokenSessao);
        return carrinhoMapper.toResponseDTO(carrinho);
    }

    @Transactional
    public CarrinhoResponseDTO adicionarItem(UUID usuarioId, String tokenSessao, AdicionarItemCarrinhoRequestDTO dto) {
        Carrinho carrinho = obterOuCriarCarrinho(usuarioId, tokenSessao);
        Produto produto = produtoFinder.findById(dto.produtoId());

        BigDecimal precoUnitario = produto.getPrecoBase();
        ItemCarrinho item = carrinhoMapper.toEntity(dto, carrinho, produto, precoUnitario);
        itemCarrinhoRepository.save(item);

        Carrinho atualizado = carrinhoRepository.findById(carrinho.getId()).orElse(carrinho);
        log.info("Item {} adicionado ao carrinho {}", produto.getSku(), carrinho.getId());
        return carrinhoMapper.toResponseDTO(atualizado);
    }

    @Transactional
    public CarrinhoResponseDTO atualizarQuantidade(UUID usuarioId, String tokenSessao, UUID itemId, AtualizarQuantidadeItemRequestDTO dto) {
        Carrinho carrinho = obterOuCriarCarrinho(usuarioId, tokenSessao);
        itemCarrinhoRepository.findByIdAndCarrinhoId(itemId, carrinho.getId()).ifPresent(item -> {
            item.setQuantidade(dto.quantidade());
            itemCarrinhoRepository.save(item);
        });

        Carrinho atualizado = carrinhoRepository.findById(carrinho.getId()).orElse(carrinho);
        return carrinhoMapper.toResponseDTO(atualizado);
    }

    @Transactional
    public CarrinhoResponseDTO removerItem(UUID usuarioId, String tokenSessao, UUID itemId) {
        Carrinho carrinho = obterOuCriarCarrinho(usuarioId, tokenSessao);
        itemCarrinhoRepository.findByIdAndCarrinhoId(itemId, carrinho.getId()).ifPresent(itemCarrinhoRepository::delete);

        Carrinho atualizado = carrinhoRepository.findById(carrinho.getId()).orElse(carrinho);
        log.info("Item {} removido do carrinho {}", itemId, carrinho.getId());
        return carrinhoMapper.toResponseDTO(atualizado);
    }

    @Transactional
    public CarrinhoResponseDTO aplicarCupom(UUID usuarioId, String tokenSessao, AplicarCupomRequestDTO dto) {
        Carrinho carrinho = obterOuCriarCarrinho(usuarioId, tokenSessao);
        CupomDesconto cupom = cupomDescontoFinder.findByCodigo(dto.codigoCupom());

        BigDecimal subtotal = carrinho.getItens().stream()
            .map(it -> it.getPrecoUnitarioMomento().multiply(BigDecimal.valueOf(it.getQuantidade())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        cupomValidator.validarAplicabilidade(cupom, subtotal);

        carrinho.setCupom(cupom);
        Carrinho atualizado = carrinhoRepository.save(carrinho);
        log.info("Cupom {} aplicado ao carrinho {}", cupom.getCodigo(), carrinho.getId());
        return carrinhoMapper.toResponseDTO(atualizado);
    }

    @Transactional
    public void limparCarrinho(UUID usuarioId, String tokenSessao) {
        Carrinho carrinho = obterOuCriarCarrinho(usuarioId, tokenSessao);
        carrinho.getItens().clear();
        carrinho.setCupom(null);
        carrinhoRepository.save(carrinho);
        log.info("Carrinho {} esvaziado com sucesso", carrinho.getId());
    }
}

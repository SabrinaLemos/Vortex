package com.vortex.vortex.modules.avaliacao.service;

import com.vortex.vortex.modules.avaliacao.dto.AvaliacaoResponseDTO;
import com.vortex.vortex.modules.avaliacao.dto.CriarAvaliacaoRequestDTO;
import com.vortex.vortex.modules.avaliacao.entity.AvaliacaoProduto;
import com.vortex.vortex.modules.avaliacao.mapper.AvaliacaoMapper;
import com.vortex.vortex.modules.avaliacao.repository.AvaliacaoProdutoRepository;
import com.vortex.vortex.modules.nfc.entity.TagNfc;
import com.vortex.vortex.modules.nfc.finder.TagNfcFinder;
import com.vortex.vortex.modules.produto.entity.Produto;
import com.vortex.vortex.modules.produto.finder.ProdutoFinder;
import com.vortex.vortex.modules.produto.repository.ProdutoRepository;
import com.vortex.vortex.modules.usuario.entity.Usuario;
import com.vortex.vortex.modules.usuario.finder.UsuarioFinder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AvaliacaoService {

    private final AvaliacaoProdutoRepository avaliacaoProdutoRepository;
    private final ProdutoRepository produtoRepository;
    private final ProdutoFinder produtoFinder;
    private final UsuarioFinder usuarioFinder;
    private final TagNfcFinder tagNfcFinder;
    private final AvaliacaoMapper avaliacaoMapper;

    @Transactional
    public AvaliacaoResponseDTO enviarAvaliacao(CriarAvaliacaoRequestDTO dto, UUID usuarioId) {
        Produto produto = produtoFinder.findById(dto.produtoId());

        Usuario usuario = null;
        if (usuarioId != null) {
            usuario = usuarioFinder.findById(usuarioId);
        }

        TagNfc tag = null;
        String metodo = "COMPRA_VERIFICADA";

        if (dto.tokenNfcOuUid() != null && !dto.tokenNfcOuUid().isBlank()) {
            try {
                tag = tagNfcFinder.findBySlugOuUid(dto.tokenNfcOuUid().trim());
                metodo = "CHIP_NFC";
            } catch (Exception ignored) {}
        } else if (dto.chaveNfe() != null && !dto.chaveNfe().isBlank()) {
            metodo = "CODIGO_NFE";
        }

        AvaliacaoProduto entity = avaliacaoMapper.toEntity(dto, produto, usuario, tag, metodo);
        AvaliacaoProduto salva = avaliacaoProdutoRepository.save(entity);

        // Recalcula média de avaliações do produto
        int totalAtual = produto.getTotalAvaliacoes() + 1;
        BigDecimal somaNotas = produto.getNotaMedia()
            .multiply(BigDecimal.valueOf(produto.getTotalAvaliacoes()))
            .add(BigDecimal.valueOf(dto.nota()));
        BigDecimal novaMedia = somaNotas.divide(BigDecimal.valueOf(totalAtual), 2, RoundingMode.HALF_UP);

        produto.setTotalAvaliacoes(totalAtual);
        produto.setNotaMedia(novaMedia);
        produtoRepository.save(produto);

        log.info("Nova avaliação auditada ({}) registrada para o produto {}", metodo, produto.getSku());
        return avaliacaoMapper.toResponseDTO(salva);
    }

    @Transactional(readOnly = true)
    public Page<AvaliacaoResponseDTO> listarPorProduto(UUID produtoId, Pageable pageable) {
        Page<AvaliacaoProduto> page = avaliacaoProdutoRepository.findByProdutoIdAndAprovadoModeracaoTrueOrderByCriadoEmDesc(produtoId, pageable);
        return page.map(avaliacaoMapper::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResponseDTO> listarDestaquesHome() {
        List<AvaliacaoProduto> destaques = avaliacaoProdutoRepository.findByDestaqueHomeTrueAndAprovadoModeracaoTrueOrderByCriadoEmDesc();
        return avaliacaoMapper.toResponseDTOList(destaques);
    }
}

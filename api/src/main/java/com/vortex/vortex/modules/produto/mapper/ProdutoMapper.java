package com.vortex.vortex.modules.produto.mapper;

import com.vortex.vortex.modules.produto.dto.ProdutoResponseDTO;
import com.vortex.vortex.modules.produto.dto.ProdutoResumoDTO;
import com.vortex.vortex.modules.produto.dto.VariacaoCorDTO;
import com.vortex.vortex.modules.produto.dto.VariacaoMaterialDTO;
import com.vortex.vortex.modules.produto.entity.Produto;
import com.vortex.vortex.modules.produto.entity.ProdutoVariacaoCor;
import com.vortex.vortex.modules.produto.entity.ProdutoVariacaoMaterial;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ProdutoMapper {

    private final CategoriaProdutoMapper categoriaProdutoMapper;

    public ProdutoResumoDTO toResumoDTO(Produto produto) {
        if (produto == null) return null;

        List<VariacaoCorDTO> cores = produto.getVariacoesCor() != null
            ? produto.getVariacoesCor().stream()
                .filter(c -> Boolean.TRUE.equals(c.getAtivo()))
                .map(this::toCorDTO)
                .toList()
            : List.of();

        return new ProdutoResumoDTO(
            produto.getId(),
            produto.getSku(),
            produto.getSlug(),
            produto.getTitulo(),
            produto.getDescricaoCurta(),
            produto.getCategoria() != null ? produto.getCategoria().getSlug() : null,
            produto.getCategoria() != null ? produto.getCategoria().getNome() : null,
            produto.getRotuloCategoria(),
            produto.getTecnologiaFabricacao().name(),
            produto.getRotuloTecnologia(),
            produto.getPrecoBase(),
            produto.getParcelamentoTexto(),
            produto.getImagemPrincipalUrl(),
            produto.getPossuiNfc(),
            produto.getEmEstoque(),
            produto.getDestaque(),
            produto.getNotaMedia(),
            produto.getTotalAvaliacoes(),
            cores
        );
    }

    public ProdutoResponseDTO toResponseDTO(Produto produto) {
        if (produto == null) return null;

        List<VariacaoMaterialDTO> materiais = produto.getVariacoesMaterial() != null
            ? produto.getVariacoesMaterial().stream()
                .filter(m -> Boolean.TRUE.equals(m.getAtivo()))
                .map(this::toMaterialDTO)
                .toList()
            : List.of();

        List<VariacaoCorDTO> cores = produto.getVariacoesCor() != null
            ? produto.getVariacoesCor().stream()
                .filter(c -> Boolean.TRUE.equals(c.getAtivo()))
                .map(this::toCorDTO)
                .toList()
            : List.of();

        return new ProdutoResponseDTO(
            produto.getId(),
            produto.getSku(),
            produto.getSlug(),
            categoriaProdutoMapper.toResponseDTO(produto.getCategoria()),
            produto.getTitulo(),
            produto.getSubtitulo(),
            produto.getDescricaoCurta(),
            produto.getDescricaoCompleta(),
            produto.getPrecoBase(),
            produto.getParcelamentoTexto(),
            produto.getTecnologiaFabricacao().name(),
            produto.getRotuloTecnologia(),
            produto.getRotuloCategoria(),
            produto.getPossuiNfc(),
            produto.getChipNfcPadrao(),
            produto.getToleranciaMilimetrica(),
            produto.getInfillPadrao(),
            produto.getAlturaCamadaPadrao(),
            produto.getPesoGramas(),
            produto.getDimensoes(),
            produto.getImagemPrincipalUrl(),
            produto.getEmEstoque(),
            produto.getDestaque(),
            produto.getNotaMedia(),
            produto.getTotalAvaliacoes(),
            materiais,
            cores,
            produto.getCriadoEm()
        );
    }

    public VariacaoMaterialDTO toMaterialDTO(ProdutoVariacaoMaterial material) {
        if (material == null) return null;
        return new VariacaoMaterialDTO(
            material.getId(),
            material.getChaveMaterial(),
            material.getNomeExibicao(),
            material.getAcrescimoPreco(),
            material.getDescricaoTecnica()
        );
    }

    public VariacaoCorDTO toCorDTO(ProdutoVariacaoCor cor) {
        if (cor == null) return null;
        return new VariacaoCorDTO(
            cor.getId(),
            cor.getNomeCor(),
            cor.getCodigoHex()
        );
    }
}

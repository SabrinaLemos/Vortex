package com.vortex.vortex.modules.avaliacao.mapper;

import com.vortex.vortex.modules.avaliacao.dto.AvaliacaoResponseDTO;
import com.vortex.vortex.modules.avaliacao.dto.CriarAvaliacaoRequestDTO;
import com.vortex.vortex.modules.avaliacao.entity.AvaliacaoProduto;
import com.vortex.vortex.modules.nfc.entity.TagNfc;
import com.vortex.vortex.modules.produto.entity.Produto;
import com.vortex.vortex.modules.usuario.entity.Usuario;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AvaliacaoMapper {

    public AvaliacaoProduto toEntity(
        CriarAvaliacaoRequestDTO dto,
        Produto produto,
        Usuario usuario,
        TagNfc tagNfc,
        String metodoValidacao
    ) {
        if (dto == null) return null;
        return AvaliacaoProduto.builder()
            .produto(produto)
            .usuario(usuario)
            .tagNfc(tagNfc)
            .nomeAutor(dto.nomeAutor())
            .organizacao(dto.organizacao())
            .nota(dto.nota())
            .comentario(dto.comentario())
            .metodoValidacao(metodoValidacao)
            .posseValidada(true)
            .aprovadoModeracao(true)
            .destaqueHome(false)
            .build();
    }

    public AvaliacaoResponseDTO toResponseDTO(AvaliacaoProduto entity) {
        if (entity == null) return null;
        return new AvaliacaoResponseDTO(
            entity.getId(),
            entity.getProduto() != null ? entity.getProduto().getId() : null,
            entity.getNomeAutor(),
            entity.getOrganizacao(),
            entity.getNota(),
            entity.getComentario(),
            entity.getMetodoValidacao(),
            entity.getPosseValidada(),
            entity.getDestaqueHome(),
            entity.getCriadoEm()
        );
    }

    public List<AvaliacaoResponseDTO> toResponseDTOList(List<AvaliacaoProduto> list) {
        if (list == null) return List.of();
        return list.stream().map(this::toResponseDTO).toList();
    }
}

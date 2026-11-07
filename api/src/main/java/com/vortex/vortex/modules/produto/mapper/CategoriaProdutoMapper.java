package com.vortex.vortex.modules.produto.mapper;

import com.vortex.vortex.modules.produto.dto.CategoriaResponseDTO;
import com.vortex.vortex.modules.produto.entity.CategoriaProduto;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CategoriaProdutoMapper {

    public CategoriaResponseDTO toResponseDTO(CategoriaProduto categoria) {
        if (categoria == null) return null;
        return new CategoriaResponseDTO(
            categoria.getId(),
            categoria.getSlug(),
            categoria.getNome(),
            categoria.getDescricao(),
            categoria.getIcone(),
            categoria.getOrdemExibicao()
        );
    }

    public List<CategoriaResponseDTO> toResponseDTOList(List<CategoriaProduto> categorias) {
        if (categorias == null) return List.of();
        return categorias.stream().map(this::toResponseDTO).toList();
    }
}

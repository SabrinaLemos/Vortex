package com.vortex.vortex.modules.produto.finder;

import com.vortex.vortex.common.exception.ResourceNotFoundException;
import com.vortex.vortex.modules.produto.entity.CategoriaProduto;
import com.vortex.vortex.modules.produto.repository.CategoriaProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CategoriaProdutoFinder {

    private final CategoriaProdutoRepository categoriaProdutoRepository;

    public CategoriaProduto findById(UUID id) {
        return categoriaProdutoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Categoria de produto", "id", id));
    }

    public CategoriaProduto findBySlug(String slug) {
        return categoriaProdutoRepository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Categoria de produto", "slug", slug));
    }
}

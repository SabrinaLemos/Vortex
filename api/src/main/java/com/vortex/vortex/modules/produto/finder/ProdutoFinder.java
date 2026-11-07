package com.vortex.vortex.modules.produto.finder;

import com.vortex.vortex.common.exception.ResourceNotFoundException;
import com.vortex.vortex.modules.produto.entity.Produto;
import com.vortex.vortex.modules.produto.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ProdutoFinder {

    private final ProdutoRepository produtoRepository;

    public Produto findById(UUID id) {
        return produtoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Produto", "id", id));
    }

    public Produto findBySlug(String slug) {
        return produtoRepository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Produto", "slug", slug));
    }

    public Produto findBySku(String sku) {
        return produtoRepository.findBySku(sku)
            .orElseThrow(() -> new ResourceNotFoundException("Produto", "SKU", sku));
    }

    public Produto findByIdOuSlug(String idOuSlug) {
        try {
            UUID id = UUID.fromString(idOuSlug);
            return findById(id);
        } catch (IllegalArgumentException e) {
            return findBySlug(idOuSlug);
        }
    }
}

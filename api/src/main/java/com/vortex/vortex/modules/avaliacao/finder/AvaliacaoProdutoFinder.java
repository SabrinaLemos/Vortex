package com.vortex.vortex.modules.avaliacao.finder;

import com.vortex.vortex.common.exception.ResourceNotFoundException;
import com.vortex.vortex.modules.avaliacao.entity.AvaliacaoProduto;
import com.vortex.vortex.modules.avaliacao.repository.AvaliacaoProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AvaliacaoProdutoFinder {

    private final AvaliacaoProdutoRepository avaliacaoProdutoRepository;

    public AvaliacaoProduto findById(UUID id) {
        return avaliacaoProdutoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Avaliação de produto", "id", id));
    }
}

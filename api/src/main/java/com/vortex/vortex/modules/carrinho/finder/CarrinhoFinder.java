package com.vortex.vortex.modules.carrinho.finder;

import com.vortex.vortex.common.exception.ResourceNotFoundException;
import com.vortex.vortex.modules.carrinho.entity.Carrinho;
import com.vortex.vortex.modules.carrinho.repository.CarrinhoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CarrinhoFinder {

    private final CarrinhoRepository carrinhoRepository;

    public Carrinho findById(UUID id) {
        return carrinhoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Carrinho", "id", id));
    }

    public Carrinho findByUsuarioId(UUID usuarioId) {
        return carrinhoRepository.findByUsuarioId(usuarioId)
            .orElseThrow(() -> new ResourceNotFoundException("Carrinho do usuário não encontrado"));
    }
}

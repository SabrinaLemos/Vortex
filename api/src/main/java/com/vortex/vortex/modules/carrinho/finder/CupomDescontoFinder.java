package com.vortex.vortex.modules.carrinho.finder;

import com.vortex.vortex.common.exception.ResourceNotFoundException;
import com.vortex.vortex.modules.carrinho.entity.CupomDesconto;
import com.vortex.vortex.modules.carrinho.repository.CupomDescontoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CupomDescontoFinder {

    private final CupomDescontoRepository cupomDescontoRepository;

    public CupomDesconto findById(UUID id) {
        return cupomDescontoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cupom de desconto", "id", id));
    }

    public CupomDesconto findByCodigo(String codigo) {
        return cupomDescontoRepository.findByCodigo(codigo.toUpperCase().trim())
            .orElseThrow(() -> new ResourceNotFoundException("Cupom de desconto", "código", codigo));
    }
}

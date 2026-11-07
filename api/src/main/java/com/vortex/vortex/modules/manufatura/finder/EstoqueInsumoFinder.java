package com.vortex.vortex.modules.manufatura.finder;

import com.vortex.vortex.common.exception.ResourceNotFoundException;
import com.vortex.vortex.modules.manufatura.entity.EstoqueInsumo;
import com.vortex.vortex.modules.manufatura.repository.EstoqueInsumoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class EstoqueInsumoFinder {

    private final EstoqueInsumoRepository estoqueInsumoRepository;

    public EstoqueInsumo findById(UUID id) {
        return estoqueInsumoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Insumo de Estoque", "id", id));
    }

    public EstoqueInsumo findBySku(String sku) {
        return estoqueInsumoRepository.findBySku(sku)
            .orElseThrow(() -> new ResourceNotFoundException("Insumo de Estoque", "SKU", sku));
    }
}

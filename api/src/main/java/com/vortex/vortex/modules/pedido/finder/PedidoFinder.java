package com.vortex.vortex.modules.pedido.finder;

import com.vortex.vortex.common.exception.ResourceNotFoundException;
import com.vortex.vortex.modules.pedido.entity.Pedido;
import com.vortex.vortex.modules.pedido.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class PedidoFinder {

    private final PedidoRepository pedidoRepository;

    public Pedido findById(UUID id) {
        return pedidoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Pedido", "id", id));
    }

    public Pedido findByCodigoOrdem(String codigoOrdem) {
        return pedidoRepository.findByCodigoOrdem(codigoOrdem.toUpperCase().trim())
            .orElseThrow(() -> new ResourceNotFoundException("Pedido", "código", codigoOrdem));
    }

    public Pedido findByIdOuCodigo(String idOuCodigo) {
        try {
            UUID id = UUID.fromString(idOuCodigo);
            return findById(id);
        } catch (IllegalArgumentException e) {
            return findByCodigoOrdem(idOuCodigo);
        }
    }
}

package com.vortex.vortex.modules.manufatura.finder;

import com.vortex.vortex.common.exception.ResourceNotFoundException;
import com.vortex.vortex.modules.manufatura.entity.OrdemProducao;
import com.vortex.vortex.modules.manufatura.repository.OrdemProducaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OrdemProducaoFinder {

    private final OrdemProducaoRepository ordemProducaoRepository;

    public OrdemProducao findById(UUID id) {
        return ordemProducaoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Ordem de Produção", "id", id));
    }

    public OrdemProducao findByCodigoOs(String codigoOs) {
        return ordemProducaoRepository.findByCodigoOs(codigoOs.toUpperCase().trim())
            .orElseThrow(() -> new ResourceNotFoundException("Ordem de Produção", "código O.S.", codigoOs));
    }

    public OrdemProducao findByIdOuCodigo(String idOuCodigo) {
        try {
            UUID id = UUID.fromString(idOuCodigo);
            return findById(id);
        } catch (IllegalArgumentException e) {
            return findByCodigoOs(idOuCodigo);
        }
    }
}

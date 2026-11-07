package com.vortex.vortex.modules.proposta.finder;

import com.vortex.vortex.common.exception.ResourceNotFoundException;
import com.vortex.vortex.modules.proposta.entity.PropostaB2b;
import com.vortex.vortex.modules.proposta.repository.PropostaB2bRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class PropostaB2bFinder {

    private final PropostaB2bRepository propostaB2bRepository;

    public PropostaB2b findById(UUID id) {
        return propostaB2bRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Proposta B2B", "id", id));
    }

    public PropostaB2b findByCodigoProposta(String codigoProposta) {
        return propostaB2bRepository.findByCodigoProposta(codigoProposta.toUpperCase().trim())
            .orElseThrow(() -> new ResourceNotFoundException("Proposta B2B", "código", codigoProposta));
    }

    public PropostaB2b findByIdOuCodigo(String idOuCodigo) {
        try {
            UUID id = UUID.fromString(idOuCodigo);
            return findById(id);
        } catch (IllegalArgumentException e) {
            return findByCodigoProposta(idOuCodigo);
        }
    }
}

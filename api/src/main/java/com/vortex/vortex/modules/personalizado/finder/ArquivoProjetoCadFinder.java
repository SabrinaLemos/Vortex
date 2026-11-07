package com.vortex.vortex.modules.personalizado.finder;

import com.vortex.vortex.common.exception.ResourceNotFoundException;
import com.vortex.vortex.modules.personalizado.entity.ArquivoProjetoCad;
import com.vortex.vortex.modules.personalizado.repository.ArquivoProjetoCadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ArquivoProjetoCadFinder {

    private final ArquivoProjetoCadRepository arquivoProjetoCadRepository;

    public ArquivoProjetoCad findById(UUID id) {
        return arquivoProjetoCadRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Arquivo de projeto CAD", "id", id));
    }
}

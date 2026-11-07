package com.vortex.vortex.modules.manufatura.finder;

import com.vortex.vortex.common.exception.ResourceNotFoundException;
import com.vortex.vortex.modules.manufatura.entity.MaquinaImpressao;
import com.vortex.vortex.modules.manufatura.repository.MaquinaImpressaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class MaquinaImpressaoFinder {

    private final MaquinaImpressaoRepository maquinaImpressaoRepository;

    public MaquinaImpressao findById(UUID id) {
        return maquinaImpressaoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Máquina de Impressão 3D", "id", id));
    }

    public MaquinaImpressao findByNome(String nome) {
        return maquinaImpressaoRepository.findByNomeIdentificador(nome)
            .orElseThrow(() -> new ResourceNotFoundException("Máquina de Impressão 3D", "nome", nome));
    }
}

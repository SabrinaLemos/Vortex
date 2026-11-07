package com.vortex.vortex.modules.usuario.finder;

import com.vortex.vortex.common.exception.ResourceNotFoundException;
import com.vortex.vortex.modules.usuario.entity.EnderecoUsuario;
import com.vortex.vortex.modules.usuario.repository.EnderecoUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class EnderecoUsuarioFinder {

    private final EnderecoUsuarioRepository enderecoUsuarioRepository;

    public EnderecoUsuario findById(UUID id) {
        return enderecoUsuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Endereço", "id", id));
    }

    public EnderecoUsuario findByIdAndUsuarioId(UUID id, UUID usuarioId) {
        return enderecoUsuarioRepository.findByIdAndUsuarioId(id, usuarioId)
            .orElseThrow(() -> new ResourceNotFoundException("Endereço não encontrado ou não pertence ao usuário"));
    }
}

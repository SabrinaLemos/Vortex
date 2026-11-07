package com.vortex.vortex.modules.usuario.finder;

import com.vortex.vortex.common.exception.ResourceNotFoundException;
import com.vortex.vortex.modules.usuario.entity.Usuario;
import com.vortex.vortex.modules.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UsuarioFinder {

    private final UsuarioRepository usuarioRepository;

    public Usuario findById(UUID id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário", "id", id));
    }

    public Usuario findByEmail(String email) {
        return usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário", "e-mail", email));
    }

    public Usuario findByTokenNfcAuth(String tokenNfcAuth) {
        return usuarioRepository.findByTokenNfcAuth(tokenNfcAuth)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário", "token NFC", tokenNfcAuth));
    }
}

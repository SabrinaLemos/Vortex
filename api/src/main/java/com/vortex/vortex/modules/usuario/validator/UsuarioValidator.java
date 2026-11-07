package com.vortex.vortex.modules.usuario.validator;

import com.vortex.vortex.common.exception.ConflictException;
import com.vortex.vortex.common.exception.BadRequestException;
import com.vortex.vortex.modules.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UsuarioValidator {

    private final UsuarioRepository usuarioRepository;

    public void validarNovoEmail(String email) {
        if (usuarioRepository.existsByEmail(email)) {
            throw new ConflictException("Já existe uma conta cadastrada com o e-mail informado.");
        }
    }

    public void validarNovoDocumento(String documento) {
        if (documento != null && !documento.isBlank() && usuarioRepository.existsByDocumento(documento)) {
            throw new ConflictException("Já existe uma conta cadastrada com o documento (CPF/CNPJ) informado.");
        }
    }

    public void validarAtualizacaoEmail(UUID usuarioId, String novoEmail) {
        usuarioRepository.findByEmail(novoEmail).ifPresent(usuarioExistente -> {
            if (!usuarioExistente.getId().equals(usuarioId)) {
                throw new ConflictException("O e-mail informado já está em uso por outro usuário.");
            }
        });
    }

    public void validarForcaSenha(String senha) {
        if (senha == null || senha.length() < 6) {
            throw new BadRequestException("A senha deve possuir no mínimo 6 caracteres.");
        }
    }
}

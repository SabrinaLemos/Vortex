package com.vortex.vortex.modules.nfc.validator;

import com.vortex.vortex.common.exception.ConflictException;
import com.vortex.vortex.common.exception.ForbiddenException;
import com.vortex.vortex.modules.nfc.entity.TagNfc;
import com.vortex.vortex.modules.nfc.repository.TagNfcRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class TagNfcValidator {

    private final TagNfcRepository tagNfcRepository;

    public void validarNovoUid(String uid) {
        if (tagNfcRepository.existsByUid(uid)) {
            throw new ConflictException("Já existe um dispositivo cadastrado com o UID de hardware informado.");
        }
    }

    public void validarNovoSlug(String slug) {
        if (slug != null && !slug.isBlank() && tagNfcRepository.existsBySlugRedirecionamento(slug)) {
            throw new ConflictException("O slug de redirecionamento informado já está em uso por outro dispositivo.");
        }
    }

    public void validarTitularidade(TagNfc tag, UUID usuarioId) {
        if (tag.getUsuarioTitular() == null || !tag.getUsuarioTitular().getId().equals(usuarioId)) {
            throw new ForbiddenException("Você não possui permissão para gerenciar as configurações deste chip NFC.");
        }
    }
}

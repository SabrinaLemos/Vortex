package com.vortex.vortex.modules.nfc.finder;

import com.vortex.vortex.common.exception.ResourceNotFoundException;
import com.vortex.vortex.modules.nfc.entity.TagNfc;
import com.vortex.vortex.modules.nfc.repository.TagNfcRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class TagNfcFinder {

    private final TagNfcRepository tagNfcRepository;

    public TagNfc findById(UUID id) {
        return tagNfcRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Tag NFC", "id", id));
    }

    public TagNfc findByUid(String uid) {
        return tagNfcRepository.findByUid(uid)
            .orElseThrow(() -> new ResourceNotFoundException("Tag NFC", "UID", uid));
    }

    public TagNfc findBySlugRedirecionamento(String slug) {
        return tagNfcRepository.findBySlugRedirecionamento(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Tag NFC", "slug", slug));
    }

    public TagNfc findBySlugOuUid(String slugOuUid) {
        return tagNfcRepository.findBySlugRedirecionamento(slugOuUid)
            .or(() -> tagNfcRepository.findByUid(slugOuUid))
            .orElseThrow(() -> new ResourceNotFoundException("Tag NFC não identificada por slug ou UID: " + slugOuUid));
    }
}

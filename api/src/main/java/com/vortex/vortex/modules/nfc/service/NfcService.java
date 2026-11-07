package com.vortex.vortex.modules.nfc.service;

import com.vortex.vortex.modules.nfc.dto.CriarTagNfcRequestDTO;
import com.vortex.vortex.modules.nfc.dto.RemapearUrlRequestDTO;
import com.vortex.vortex.modules.nfc.dto.TagNfcResponseDTO;
import com.vortex.vortex.modules.nfc.entity.TagNfc;
import com.vortex.vortex.modules.nfc.finder.TagNfcFinder;
import com.vortex.vortex.modules.nfc.mapper.TagNfcMapper;
import com.vortex.vortex.modules.nfc.repository.TagNfcRepository;
import com.vortex.vortex.modules.nfc.support.NfcTelemetrySupport;
import com.vortex.vortex.modules.nfc.validator.TagNfcValidator;
import com.vortex.vortex.modules.usuario.entity.Usuario;
import com.vortex.vortex.modules.usuario.finder.UsuarioFinder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class NfcService {

    private final TagNfcRepository tagNfcRepository;
    private final TagNfcFinder tagNfcFinder;
    private final TagNfcValidator tagNfcValidator;
    private final TagNfcMapper tagNfcMapper;
    private final UsuarioFinder usuarioFinder;
    private final NfcTelemetrySupport nfcTelemetrySupport;

    @Transactional
    public String resolverRedirecionamento(String slugOuUid, String ipOrigem, String userAgent) {
        TagNfc tag = tagNfcFinder.findBySlugOuUid(slugOuUid);
        nfcTelemetrySupport.registrarToque(tag, ipOrigem, userAgent);
        return tag.getUrlDestino();
    }

    @Transactional(readOnly = true)
    public TagNfcResponseDTO buscarPorSlugOuUid(String slugOuUid) {
        TagNfc tag = tagNfcFinder.findBySlugOuUid(slugOuUid);
        return tagNfcMapper.toResponseDTO(tag);
    }

    @Transactional(readOnly = true)
    public List<TagNfcResponseDTO> listarMinhasTags(UUID usuarioId) {
        List<TagNfc> tags = tagNfcRepository.findByUsuarioTitularIdOrderByCriadoEmDesc(usuarioId);
        return tagNfcMapper.toResponseDTOList(tags);
    }

    @Transactional
    public TagNfcResponseDTO remapearUrl(UUID tagId, UUID usuarioId, RemapearUrlRequestDTO dto) {
        TagNfc tag = tagNfcFinder.findById(tagId);
        tagNfcValidator.validarTitularidade(tag, usuarioId);

        tag.setUrlDestino(dto.urlDestino().trim());
        if (dto.apelido() != null && !dto.apelido().isBlank()) {
            tag.setApelido(dto.apelido().trim());
        }

        TagNfc salva = tagNfcRepository.save(tag);
        log.info("URL da Tag NFC {} remapeada para: {}", tag.getUid(), salva.getUrlDestino());
        return tagNfcMapper.toResponseDTO(salva);
    }

    @Transactional
    public TagNfcResponseDTO registrarNovaTag(CriarTagNfcRequestDTO dto) {
        tagNfcValidator.validarNovoUid(dto.uid());
        tagNfcValidator.validarNovoSlug(dto.slugRedirecionamento());

        Usuario titular = null;
        if (dto.usuarioTitularId() != null) {
            titular = usuarioFinder.findById(dto.usuarioTitularId());
        }

        TagNfc novaTag = tagNfcMapper.toEntity(dto, titular);
        TagNfc salva = tagNfcRepository.save(novaTag);
        log.info("Nova Tag NFC registrada no laboratório: {} (ID: {})", salva.getUid(), salva.getId());
        return tagNfcMapper.toResponseDTO(salva);
    }
}

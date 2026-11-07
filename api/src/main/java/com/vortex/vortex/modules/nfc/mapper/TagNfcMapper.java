package com.vortex.vortex.modules.nfc.mapper;

import com.vortex.vortex.modules.nfc.dto.CriarTagNfcRequestDTO;
import com.vortex.vortex.modules.nfc.dto.TagNfcResponseDTO;
import com.vortex.vortex.modules.nfc.entity.TagNfc;
import com.vortex.vortex.modules.nfc.enums.LockBitStatus;
import com.vortex.vortex.modules.nfc.enums.TipoChipNfc;
import com.vortex.vortex.modules.usuario.entity.Usuario;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TagNfcMapper {

    public TagNfc toEntity(CriarTagNfcRequestDTO dto, Usuario titular) {
        if (dto == null) return null;
        return TagNfc.builder()
            .uid(dto.uid().toUpperCase().trim())
            .usuarioTitular(titular)
            .tipoChip(dto.tipoChip() != null ? dto.tipoChip() : TipoChipNfc.NTAG213)
            .apelido(dto.apelido())
            .slugRedirecionamento(dto.slugRedirecionamento() != null ? dto.slugRedirecionamento().toLowerCase().trim() : null)
            .urlDestino(dto.urlDestino().trim())
            .lockBitStatus(LockBitStatus.PROTEGIDO_SENHA)
            .contagemToques(0)
            .ativo(true)
            .build();
    }

    public TagNfcResponseDTO toResponseDTO(TagNfc tag) {
        if (tag == null) return null;
        return new TagNfcResponseDTO(
            tag.getId(),
            tag.getUid(),
            tag.getTipoChip().name(),
            tag.getApelido(),
            tag.getSlugRedirecionamento(),
            tag.getUrlDestino(),
            tag.getLockBitStatus().name(),
            tag.getContagemToques(),
            tag.getUltimoToqueEm(),
            tag.getAtivo()
        );
    }

    public List<TagNfcResponseDTO> toResponseDTOList(List<TagNfc> tags) {
        if (tags == null) return List.of();
        return tags.stream().map(this::toResponseDTO).toList();
    }
}

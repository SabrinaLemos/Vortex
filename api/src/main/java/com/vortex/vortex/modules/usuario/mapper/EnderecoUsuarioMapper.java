package com.vortex.vortex.modules.usuario.mapper;

import com.vortex.vortex.modules.usuario.dto.EnderecoRequestDTO;
import com.vortex.vortex.modules.usuario.dto.EnderecoResponseDTO;
import com.vortex.vortex.modules.usuario.entity.EnderecoUsuario;
import com.vortex.vortex.modules.usuario.entity.Usuario;
import com.vortex.vortex.modules.usuario.enums.TipoEndereco;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EnderecoUsuarioMapper {

    public EnderecoUsuario toEntity(EnderecoRequestDTO dto, Usuario usuario) {
        if (dto == null) return null;
        return EnderecoUsuario.builder()
            .usuario(usuario)
            .destinatario(dto.destinatario())
            .cep(dto.cep().replaceAll("\\D", ""))
            .logradouro(dto.logradouro())
            .numero(dto.numero())
            .complemento(dto.complemento())
            .bairro(dto.bairro())
            .cidade(dto.cidade())
            .uf(dto.uf().toUpperCase())
            .tipo(dto.tipo() != null ? dto.tipo() : TipoEndereco.ENTREGA)
            .padrao(Boolean.TRUE.equals(dto.padrao()))
            .build();
    }

    public EnderecoResponseDTO toResponseDTO(EnderecoUsuario entity) {
        if (entity == null) return null;
        return new EnderecoResponseDTO(
            entity.getId(),
            entity.getDestinatario(),
            entity.getCep(),
            entity.getLogradouro(),
            entity.getNumero(),
            entity.getComplemento(),
            entity.getBairro(),
            entity.getCidade(),
            entity.getUf(),
            entity.getTipo(),
            entity.getPadrao(),
            entity.getCriadoEm()
        );
    }

    public List<EnderecoResponseDTO> toResponseDTOList(List<EnderecoUsuario> entities) {
        if (entities == null) return List.of();
        return entities.stream().map(this::toResponseDTO).toList();
    }
}

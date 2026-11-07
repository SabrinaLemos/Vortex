package com.vortex.vortex.modules.proposta.mapper;

import com.vortex.vortex.modules.proposta.dto.CriarPropostaB2bRequestDTO;
import com.vortex.vortex.modules.proposta.dto.PropostaB2bResponseDTO;
import com.vortex.vortex.modules.proposta.entity.PropostaB2b;
import com.vortex.vortex.modules.proposta.enums.StatusPropostaB2b;
import com.vortex.vortex.modules.usuario.entity.Usuario;
import org.springframework.stereotype.Component;

@Component
public class PropostaB2bMapper {

    public PropostaB2b toEntity(CriarPropostaB2bRequestDTO dto, String codigoProposta, Usuario usuario) {
        if (dto == null) return null;
        return PropostaB2b.builder()
            .codigoProposta(codigoProposta)
            .usuario(usuario)
            .nomeResponsavel(dto.nome())
            .empresa(dto.empresa())
            .cnpj(dto.cnpj().replaceAll("\\D", ""))
            .email(dto.email().toLowerCase().trim())
            .telefone(dto.telefone())
            .modalidade(dto.modalidade())
            .volumeEstimado(dto.volumeEstimado())
            .descricaoProjeto(dto.descricao())
            .incluiChipNfc(Boolean.TRUE.equals(dto.incluiChipNfc()))
            .incluiGravacaoLaser(Boolean.TRUE.equals(dto.incluiGravacaoLaser()))
            .status(StatusPropostaB2b.RECEBIDA)
            .build();
    }

    public PropostaB2bResponseDTO toResponseDTO(PropostaB2b entity) {
        if (entity == null) return null;
        return new PropostaB2bResponseDTO(
            entity.getId(),
            entity.getCodigoProposta(),
            entity.getNomeResponsavel(),
            entity.getEmpresa(),
            entity.getCnpj(),
            entity.getEmail(),
            entity.getTelefone(),
            entity.getModalidade(),
            entity.getVolumeEstimado(),
            entity.getDescricaoProjeto(),
            entity.getIncluiChipNfc(),
            entity.getIncluiGravacaoLaser(),
            entity.getStatus().name(),
            entity.getValorTotalEstimado(),
            entity.getPrazoDiasEstimado(),
            entity.getEngenheiroResponsavel(),
            entity.getCriadoEm()
        );
    }
}

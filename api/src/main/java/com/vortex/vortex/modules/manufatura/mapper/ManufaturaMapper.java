package com.vortex.vortex.modules.manufatura.mapper;

import com.vortex.vortex.modules.manufatura.dto.CriarOrdemProducaoRequestDTO;
import com.vortex.vortex.modules.manufatura.dto.EstoqueInsumoResponseDTO;
import com.vortex.vortex.modules.manufatura.dto.MaquinaImpressaoResponseDTO;
import com.vortex.vortex.modules.manufatura.dto.OrdemProducaoResponseDTO;
import com.vortex.vortex.modules.manufatura.entity.EstoqueInsumo;
import com.vortex.vortex.modules.manufatura.entity.MaquinaImpressao;
import com.vortex.vortex.modules.manufatura.entity.OrdemProducao;
import com.vortex.vortex.modules.manufatura.enums.StatusOrdemProducao;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class ManufaturaMapper {

    public OrdemProducao toEntity(CriarOrdemProducaoRequestDTO dto, String codigoOs, MaquinaImpressao maquina) {
        if (dto == null) return null;
        return OrdemProducao.builder()
            .codigoOs(codigoOs)
            .clienteDescricao(dto.cliente())
            .produtoDescricao(dto.produto())
            .quantidadePlanejada(dto.quantidade())
            .quantidadeProduzida(0)
            .maquina(maquina)
            .materialUtilizado(dto.material())
            .pesoFilamentoEstimadoGramas(dto.pesoFilamento())
            .status(StatusOrdemProducao.FILA_FATIAMENTO)
            .build();
    }

    public OrdemProducaoResponseDTO toOrdemResponseDTO(OrdemProducao entity) {
        if (entity == null) return null;
        return new OrdemProducaoResponseDTO(
            entity.getId(),
            entity.getCodigoOs(),
            entity.getClienteDescricao(),
            entity.getProdutoDescricao(),
            entity.getQuantidadePlanejada(),
            entity.getQuantidadeProduzida(),
            entity.getMaquina() != null ? entity.getMaquina().getNomeIdentificador() : "Sem máquina alocada",
            entity.getStatus().name(),
            entity.getMaterialUtilizado(),
            entity.getPesoFilamentoEstimadoGramas(),
            entity.getCriadoEm()
        );
    }

    public MaquinaImpressaoResponseDTO toMaquinaResponseDTO(MaquinaImpressao entity) {
        if (entity == null) return null;
        return new MaquinaImpressaoResponseDTO(
            entity.getId(),
            entity.getNomeIdentificador(),
            entity.getTecnologia(),
            entity.getStatus().name(),
            entity.getTemperaturaBicoCelsius(),
            entity.getTemperaturaMesaCelsius(),
            entity.getNozzleDiametro(),
            entity.getCamadaAtual(),
            entity.getTotalCamadas(),
            entity.getTempoRestanteMinutos()
        );
    }

    public List<MaquinaImpressaoResponseDTO> toMaquinaResponseDTOList(List<MaquinaImpressao> list) {
        if (list == null) return List.of();
        return list.stream().map(this::toMaquinaResponseDTO).toList();
    }

    public EstoqueInsumoResponseDTO toEstoqueResponseDTO(EstoqueInsumo entity) {
        if (entity == null) return null;
        boolean estoqueBaixo = false;

        if (entity.getPesoLiquidoGramasTotal() != null && entity.getEstoqueMinimoAlerta() != null) {
            estoqueBaixo = entity.getPesoLiquidoGramasTotal().compareTo(entity.getEstoqueMinimoAlerta()) <= 0;
        } else if (entity.getQuantidadeUnidades() != null && entity.getEstoqueMinimoAlerta() != null) {
            estoqueBaixo = BigDecimal.valueOf(entity.getQuantidadeUnidades()).compareTo(entity.getEstoqueMinimoAlerta()) <= 0;
        }

        return new EstoqueInsumoResponseDTO(
            entity.getId(),
            entity.getSku(),
            entity.getNome(),
            entity.getCategoriaInsumo().name(),
            entity.getCor(),
            entity.getPesoLiquidoGramasTotal(),
            entity.getQuantidadeUnidades(),
            entity.getEstoqueMinimoAlerta(),
            entity.getFornecedor(),
            estoqueBaixo
        );
    }

    public List<EstoqueInsumoResponseDTO> toEstoqueResponseDTOList(List<EstoqueInsumo> list) {
        if (list == null) return List.of();
        return list.stream().map(this::toEstoqueResponseDTO).toList();
    }
}

package com.vortex.vortex.modules.personalizado.service;

import com.vortex.vortex.modules.personalizado.dto.ArquivoProjetoCadResponseDTO;
import com.vortex.vortex.modules.personalizado.entity.ArquivoProjetoCad;
import com.vortex.vortex.modules.personalizado.finder.ArquivoProjetoCadFinder;
import com.vortex.vortex.modules.personalizado.mapper.ArquivoProjetoCadMapper;
import com.vortex.vortex.modules.personalizado.repository.ArquivoProjetoCadRepository;
import com.vortex.vortex.modules.personalizado.support.CadEstimatorSupport;
import com.vortex.vortex.modules.personalizado.support.LocalStorageSupport;
import com.vortex.vortex.modules.personalizado.validator.ArquivoProjetoCadValidator;
import com.vortex.vortex.modules.usuario.entity.Usuario;
import com.vortex.vortex.modules.usuario.finder.UsuarioFinder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PersonalizadoService {

    private final ArquivoProjetoCadRepository arquivoProjetoCadRepository;
    private final ArquivoProjetoCadFinder arquivoProjetoCadFinder;
    private final ArquivoProjetoCadValidator arquivoProjetoCadValidator;
    private final ArquivoProjetoCadMapper arquivoProjetoCadMapper;
    private final LocalStorageSupport localStorageSupport;
    private final CadEstimatorSupport cadEstimatorSupport;
    private final UsuarioFinder usuarioFinder;

    @Transactional
    public ArquivoProjetoCadResponseDTO processarUploadCad(
        MultipartFile file,
        String alturaCamada,
        String infill,
        String material,
        String cor,
        Boolean possuiChipNfc,
        String payloadNfc,
        String briefing,
        UUID usuarioId
    ) {
        arquivoProjetoCadValidator.validarArquivo(file);

        String storagePath = localStorageSupport.armazenarArquivo(file);
        BigDecimal orcamento = cadEstimatorSupport.calcularOrcamento(alturaCamada, material, possuiChipNfc);

        String nomeOriginal = file.getOriginalFilename();
        String extensao = nomeOriginal != null && nomeOriginal.contains(".")
            ? nomeOriginal.substring(nomeOriginal.lastIndexOf(".") + 1).toUpperCase()
            : "STL";

        Usuario usuario = null;
        if (usuarioId != null) {
            usuario = usuarioFinder.findById(usuarioId);
        }

        ArquivoProjetoCad entity = arquivoProjetoCadMapper.toEntity(
            nomeOriginal,
            file.getSize(),
            extensao,
            storagePath,
            alturaCamada,
            infill,
            material,
            cor,
            possuiChipNfc,
            payloadNfc,
            briefing,
            orcamento,
            usuario
        );

        ArquivoProjetoCad salvo = arquivoProjetoCadRepository.save(entity);
        log.info("Projeto CAD {} processado e orçado em R$ {}", salvo.getNomeArquivoOriginal(), salvo.getOrcamentoEstimado());

        return arquivoProjetoCadMapper.toResponseDTO(salvo);
    }

    @Transactional(readOnly = true)
    public ArquivoProjetoCadResponseDTO buscarPorId(UUID id) {
        ArquivoProjetoCad entity = arquivoProjetoCadFinder.findById(id);
        return arquivoProjetoCadMapper.toResponseDTO(entity);
    }
}

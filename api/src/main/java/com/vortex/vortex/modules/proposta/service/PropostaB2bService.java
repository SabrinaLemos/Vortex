package com.vortex.vortex.modules.proposta.service;

import com.vortex.vortex.modules.proposta.dto.CriarPropostaB2bRequestDTO;
import com.vortex.vortex.modules.proposta.dto.PropostaB2bResponseDTO;
import com.vortex.vortex.modules.proposta.entity.PropostaB2b;
import com.vortex.vortex.modules.proposta.finder.PropostaB2bFinder;
import com.vortex.vortex.modules.proposta.mapper.PropostaB2bMapper;
import com.vortex.vortex.modules.proposta.repository.PropostaB2bRepository;
import com.vortex.vortex.modules.usuario.entity.Usuario;
import com.vortex.vortex.modules.usuario.finder.UsuarioFinder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.Random;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PropostaB2bService {

    private final PropostaB2bRepository propostaB2bRepository;
    private final PropostaB2bFinder propostaB2bFinder;
    private final PropostaB2bMapper propostaB2bMapper;
    private final UsuarioFinder usuarioFinder;

    @Transactional
    public PropostaB2bResponseDTO criarProposta(CriarPropostaB2bRequestDTO dto, UUID usuarioId) {
        Usuario usuario = null;
        if (usuarioId != null) {
            usuario = usuarioFinder.findById(usuarioId);
        }

        String codigoProposta = String.format("B2B-%d-%03d", Year.now().getValue(), new Random().nextInt(1000));
        PropostaB2b entity = propostaB2bMapper.toEntity(dto, codigoProposta, usuario);
        PropostaB2b salva = propostaB2bRepository.save(entity);

        log.info("Nova proposta corporativa B2B registrada: {} da empresa {}", salva.getCodigoProposta(), salva.getEmpresa());
        return propostaB2bMapper.toResponseDTO(salva);
    }

    @Transactional(readOnly = true)
    public PropostaB2bResponseDTO buscarPorIdOuCodigo(String idOuCodigo) {
        PropostaB2b proposta = propostaB2bFinder.findByIdOuCodigo(idOuCodigo);
        return propostaB2bMapper.toResponseDTO(proposta);
    }
}

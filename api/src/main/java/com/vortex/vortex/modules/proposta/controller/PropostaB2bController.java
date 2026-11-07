package com.vortex.vortex.modules.proposta.controller;

import com.vortex.vortex.modules.proposta.dto.CriarPropostaB2bRequestDTO;
import com.vortex.vortex.modules.proposta.dto.PropostaB2bResponseDTO;
import com.vortex.vortex.modules.proposta.service.PropostaB2bService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/propostas-b2b")
@RequiredArgsConstructor
public class PropostaB2bController {

    private final PropostaB2bService propostaB2bService;

    @PostMapping
    public ResponseEntity<PropostaB2bResponseDTO> submeterProposta(
        @Valid @RequestBody CriarPropostaB2bRequestDTO dto,
        @AuthenticationPrincipal String usuarioIdString
    ) {
        UUID usuarioId = usuarioIdString != null ? UUID.fromString(usuarioIdString) : null;
        PropostaB2bResponseDTO response = propostaB2bService.criarProposta(dto, usuarioId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{idOuCodigo}")
    public ResponseEntity<PropostaB2bResponseDTO> buscarProposta(@PathVariable String idOuCodigo) {
        PropostaB2bResponseDTO response = propostaB2bService.buscarPorIdOuCodigo(idOuCodigo);
        return ResponseEntity.ok(response);
    }
}

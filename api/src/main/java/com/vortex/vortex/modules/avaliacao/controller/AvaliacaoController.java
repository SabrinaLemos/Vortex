package com.vortex.vortex.modules.avaliacao.controller;

import com.vortex.vortex.modules.avaliacao.dto.AvaliacaoResponseDTO;
import com.vortex.vortex.modules.avaliacao.dto.CriarAvaliacaoRequestDTO;
import com.vortex.vortex.modules.avaliacao.service.AvaliacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/avaliacoes")
@RequiredArgsConstructor
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    @PostMapping
    public ResponseEntity<AvaliacaoResponseDTO> enviarAvaliacao(
        @Valid @RequestBody CriarAvaliacaoRequestDTO dto,
        @AuthenticationPrincipal String usuarioIdString
    ) {
        UUID usuarioId = usuarioIdString != null ? UUID.fromString(usuarioIdString) : null;
        AvaliacaoResponseDTO response = avaliacaoService.enviarAvaliacao(dto, usuarioId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/produto/{produtoId}")
    public ResponseEntity<Page<AvaliacaoResponseDTO>> listarPorProduto(
        @PathVariable UUID produtoId,
        @PageableDefault(size = 10, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AvaliacaoResponseDTO> response = avaliacaoService.listarPorProduto(produtoId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/destaques")
    public ResponseEntity<List<AvaliacaoResponseDTO>> listarDestaquesHome() {
        List<AvaliacaoResponseDTO> response = avaliacaoService.listarDestaquesHome();
        return ResponseEntity.ok(response);
    }
}

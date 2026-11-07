package com.vortex.vortex.modules.nfc.controller;

import com.vortex.vortex.modules.nfc.dto.CriarTagNfcRequestDTO;
import com.vortex.vortex.modules.nfc.dto.RemapearUrlRequestDTO;
import com.vortex.vortex.modules.nfc.dto.TagNfcResponseDTO;
import com.vortex.vortex.modules.nfc.service.NfcService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class NfcController {

    private final NfcService nfcService;

    // Rota pública de redirecionamento instantâneo via aproximação de smartphone (ex: /id/lucas-mendonca)
    @GetMapping("/id/{slug}")
    public ResponseEntity<Void> redirecionarPorSlug(
        @PathVariable String slug,
        HttpServletRequest request
    ) {
        String ip = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        String urlDestino = nfcService.resolverRedirecionamento(slug, ip, userAgent);

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(urlDestino));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @GetMapping("/api/v1/nfc/{slugOuUid}")
    public ResponseEntity<TagNfcResponseDTO> buscarTag(@PathVariable String slugOuUid) {
        TagNfcResponseDTO response = nfcService.buscarPorSlugOuUid(slugOuUid);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/v1/nfc/minhas-tags")
    public ResponseEntity<List<TagNfcResponseDTO>> listarMinhasTags(
        @AuthenticationPrincipal String usuarioIdString
    ) {
        UUID usuarioId = UUID.fromString(usuarioIdString);
        List<TagNfcResponseDTO> response = nfcService.listarMinhasTags(usuarioId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/api/v1/nfc/{id}/url")
    public ResponseEntity<TagNfcResponseDTO> remapearUrl(
        @PathVariable UUID id,
        @AuthenticationPrincipal String usuarioIdString,
        @Valid @RequestBody RemapearUrlRequestDTO dto
    ) {
        UUID usuarioId = UUID.fromString(usuarioIdString);
        TagNfcResponseDTO response = nfcService.remapearUrl(id, usuarioId, dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/v1/nfc")
    public ResponseEntity<TagNfcResponseDTO> registrarNovaTag(
        @Valid @RequestBody CriarTagNfcRequestDTO dto
    ) {
        TagNfcResponseDTO response = nfcService.registrarNovaTag(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

package com.vortex.vortex.modules.personalizado.controller;

import com.vortex.vortex.modules.personalizado.dto.ArquivoProjetoCadResponseDTO;
import com.vortex.vortex.modules.personalizado.service.PersonalizadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/personalizados")
@RequiredArgsConstructor
public class PersonalizadoController {

    private final PersonalizadoService personalizadoService;

    @PostMapping(value = "/upload-cad", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ArquivoProjetoCadResponseDTO> uploadCad(
        @RequestParam("arquivo") MultipartFile arquivo,
        @RequestParam(value = "alturaCamada", required = false) String alturaCamada,
        @RequestParam(value = "infill", required = false) String infill,
        @RequestParam(value = "material", required = false) String material,
        @RequestParam(value = "cor", required = false) String cor,
        @RequestParam(value = "possuiChipNfc", required = false) Boolean possuiChipNfc,
        @RequestParam(value = "payloadNfc", required = false) String payloadNfc,
        @RequestParam(value = "briefing", required = false) String briefing,
        @AuthenticationPrincipal String usuarioIdString
    ) {
        UUID usuarioId = usuarioIdString != null ? UUID.fromString(usuarioIdString) : null;
        ArquivoProjetoCadResponseDTO response = personalizadoService.processarUploadCad(
            arquivo,
            alturaCamada,
            infill,
            material,
            cor,
            possuiChipNfc,
            payloadNfc,
            briefing,
            usuarioId
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArquivoProjetoCadResponseDTO> buscarProjeto(@PathVariable UUID id) {
        ArquivoProjetoCadResponseDTO response = personalizadoService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }
}

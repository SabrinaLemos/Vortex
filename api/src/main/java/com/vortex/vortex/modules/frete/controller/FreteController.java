package com.vortex.vortex.modules.frete.controller;

import com.vortex.vortex.modules.frete.dto.FreteCalculoRequestDTO;
import com.vortex.vortex.modules.frete.dto.OpcaoFreteDTO;
import com.vortex.vortex.modules.frete.service.FreteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/frete")
@RequiredArgsConstructor
public class FreteController {

    private final FreteService freteService;

    @PostMapping("/calcular")
    public ResponseEntity<List<OpcaoFreteDTO>> calcularFrete(
        @Valid @RequestBody FreteCalculoRequestDTO dto
    ) {
        List<OpcaoFreteDTO> response = freteService.calcularOpcoesFrete(dto);
        return ResponseEntity.ok(response);
    }
}

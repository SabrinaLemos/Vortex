package com.vortex.vortex.modules.manufatura.controller;

import com.vortex.vortex.modules.manufatura.dto.AdminDashboardDTO;
import com.vortex.vortex.modules.manufatura.dto.AtualizarStatusOrdemRequestDTO;
import com.vortex.vortex.modules.manufatura.dto.CriarOrdemProducaoRequestDTO;
import com.vortex.vortex.modules.manufatura.dto.EstoqueInsumoResponseDTO;
import com.vortex.vortex.modules.manufatura.dto.MaquinaImpressaoResponseDTO;
import com.vortex.vortex.modules.manufatura.dto.OrdemProducaoResponseDTO;
import com.vortex.vortex.modules.manufatura.service.ManufaturaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminManufaturaController {

    private final ManufaturaService manufaturaService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDTO> obterDashboard() {
        AdminDashboardDTO response = manufaturaService.obterDashboardMetricas();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ordens-producao")
    public ResponseEntity<Page<OrdemProducaoResponseDTO>> listarOrdensProducao(
        @PageableDefault(size = 15, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<OrdemProducaoResponseDTO> response = manufaturaService.listarOrdensProducao(pageable);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/ordens-producao")
    public ResponseEntity<OrdemProducaoResponseDTO> criarOrdemProducao(
        @Valid @RequestBody CriarOrdemProducaoRequestDTO dto
    ) {
        OrdemProducaoResponseDTO response = manufaturaService.criarOrdemProducao(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/ordens-producao/{id}/status")
    public ResponseEntity<OrdemProducaoResponseDTO> atualizarStatusOrdem(
        @PathVariable UUID id,
        @Valid @RequestBody AtualizarStatusOrdemRequestDTO dto
    ) {
        OrdemProducaoResponseDTO response = manufaturaService.atualizarStatusOrdem(id, dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/maquinas")
    public ResponseEntity<List<MaquinaImpressaoResponseDTO>> listarMaquinas() {
        List<MaquinaImpressaoResponseDTO> response = manufaturaService.listarMaquinas();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/estoque")
    public ResponseEntity<List<EstoqueInsumoResponseDTO>> listarEstoque() {
        List<EstoqueInsumoResponseDTO> response = manufaturaService.listarEstoqueInsumos();
        return ResponseEntity.ok(response);
    }
}

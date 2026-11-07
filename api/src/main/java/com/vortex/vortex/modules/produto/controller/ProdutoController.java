package com.vortex.vortex.modules.produto.controller;

import com.vortex.vortex.modules.produto.dto.ProdutoFiltroRequestDTO;
import com.vortex.vortex.modules.produto.dto.ProdutoResponseDTO;
import com.vortex.vortex.modules.produto.dto.ProdutoResumoDTO;
import com.vortex.vortex.modules.produto.service.ProdutoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService produtoService;

    @GetMapping
    public ResponseEntity<Page<ProdutoResumoDTO>> listarProdutos(
        @RequestParam(required = false) String categoria,
        @RequestParam(required = false) String tecnologia,
        @RequestParam(required = false) BigDecimal precoMaximo,
        @RequestParam(required = false) String busca,
        @RequestParam(required = false) Boolean apenasNfc,
        @RequestParam(required = false) Boolean destaque,
        @PageableDefault(size = 12, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        ProdutoFiltroRequestDTO filtro = new ProdutoFiltroRequestDTO(
            categoria,
            tecnologia,
            precoMaximo,
            busca,
            apenasNfc,
            destaque
        );
        Page<ProdutoResumoDTO> response = produtoService.listarProdutosPaginado(filtro, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{idOuSlug}")
    public ResponseEntity<ProdutoResponseDTO> buscarPorIdOuSlug(@PathVariable String idOuSlug) {
        ProdutoResponseDTO response = produtoService.buscarPorIdOuSlug(idOuSlug);
        return ResponseEntity.ok(response);
    }
}

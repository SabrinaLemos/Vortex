package com.vortex.vortex.modules.produto.controller;

import com.vortex.vortex.modules.produto.dto.CategoriaResponseDTO;
import com.vortex.vortex.modules.produto.service.ProdutoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final ProdutoService produtoService;

    @GetMapping
    public ResponseEntity<List<CategoriaResponseDTO>> listarCategorias() {
        List<CategoriaResponseDTO> response = produtoService.listarCategoriasAtivas();
        return ResponseEntity.ok(response);
    }
}

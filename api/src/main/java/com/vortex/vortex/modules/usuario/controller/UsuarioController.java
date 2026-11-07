package com.vortex.vortex.modules.usuario.controller;

import com.vortex.vortex.modules.usuario.dto.EnderecoRequestDTO;
import com.vortex.vortex.modules.usuario.dto.EnderecoResponseDTO;
import com.vortex.vortex.modules.usuario.dto.UsuarioAtualizarRequestDTO;
import com.vortex.vortex.modules.usuario.dto.UsuarioResponseDTO;
import com.vortex.vortex.modules.usuario.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarPerfil(@PathVariable UUID id) {
        UsuarioResponseDTO response = usuarioService.buscarPerfil(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> atualizarPerfil(
        @PathVariable UUID id,
        @Valid @RequestBody UsuarioAtualizarRequestDTO dto
    ) {
        UsuarioResponseDTO response = usuarioService.atualizarPerfil(id, dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/enderecos")
    public ResponseEntity<List<EnderecoResponseDTO>> listarEnderecos(@PathVariable UUID id) {
        List<EnderecoResponseDTO> response = usuarioService.listarEnderecos(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/enderecos")
    public ResponseEntity<EnderecoResponseDTO> adicionarEndereco(
        @PathVariable UUID id,
        @Valid @RequestBody EnderecoRequestDTO dto
    ) {
        EnderecoResponseDTO response = usuarioService.adicionarEndereco(id, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}/enderecos/{enderecoId}")
    public ResponseEntity<Void> removerEndereco(
        @PathVariable UUID id,
        @PathVariable UUID enderecoId
    ) {
        usuarioService.removerEndereco(id, enderecoId);
        return ResponseEntity.noContent().build();
    }
}

package com.vortex.vortex.modules.carrinho.controller;

import com.vortex.vortex.modules.carrinho.dto.AdicionarItemCarrinhoRequestDTO;
import com.vortex.vortex.modules.carrinho.dto.AplicarCupomRequestDTO;
import com.vortex.vortex.modules.carrinho.dto.AtualizarQuantidadeItemRequestDTO;
import com.vortex.vortex.modules.carrinho.dto.CarrinhoResponseDTO;
import com.vortex.vortex.modules.carrinho.service.CarrinhoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/carrinho")
@RequiredArgsConstructor
public class CarrinhoController {

    private final CarrinhoService carrinhoService;

    @GetMapping
    public ResponseEntity<CarrinhoResponseDTO> consultarCarrinho(
        @AuthenticationPrincipal String usuarioIdString,
        @RequestHeader(value = "X-Session-Token", required = false) String sessionToken
    ) {
        UUID usuarioId = usuarioIdString != null ? UUID.fromString(usuarioIdString) : null;
        CarrinhoResponseDTO response = carrinhoService.consultarCarrinho(usuarioId, sessionToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/itens")
    public ResponseEntity<CarrinhoResponseDTO> adicionarItem(
        @AuthenticationPrincipal String usuarioIdString,
        @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
        @Valid @RequestBody AdicionarItemCarrinhoRequestDTO dto
    ) {
        UUID usuarioId = usuarioIdString != null ? UUID.fromString(usuarioIdString) : null;
        CarrinhoResponseDTO response = carrinhoService.adicionarItem(usuarioId, sessionToken, dto);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/itens/{id}")
    public ResponseEntity<CarrinhoResponseDTO> atualizarQuantidade(
        @AuthenticationPrincipal String usuarioIdString,
        @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
        @PathVariable UUID id,
        @Valid @RequestBody AtualizarQuantidadeItemRequestDTO dto
    ) {
        UUID usuarioId = usuarioIdString != null ? UUID.fromString(usuarioIdString) : null;
        CarrinhoResponseDTO response = carrinhoService.atualizarQuantidade(usuarioId, sessionToken, id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/itens/{id}")
    public ResponseEntity<CarrinhoResponseDTO> removerItem(
        @AuthenticationPrincipal String usuarioIdString,
        @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
        @PathVariable UUID id
    ) {
        UUID usuarioId = usuarioIdString != null ? UUID.fromString(usuarioIdString) : null;
        CarrinhoResponseDTO response = carrinhoService.removerItem(usuarioId, sessionToken, id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/cupom")
    public ResponseEntity<CarrinhoResponseDTO> aplicarCupom(
        @AuthenticationPrincipal String usuarioIdString,
        @RequestHeader(value = "X-Session-Token", required = false) String sessionToken,
        @Valid @RequestBody AplicarCupomRequestDTO dto
    ) {
        UUID usuarioId = usuarioIdString != null ? UUID.fromString(usuarioIdString) : null;
        CarrinhoResponseDTO response = carrinhoService.aplicarCupom(usuarioId, sessionToken, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/limpar")
    public ResponseEntity<Void> limparCarrinho(
        @AuthenticationPrincipal String usuarioIdString,
        @RequestHeader(value = "X-Session-Token", required = false) String sessionToken
    ) {
        UUID usuarioId = usuarioIdString != null ? UUID.fromString(usuarioIdString) : null;
        carrinhoService.limparCarrinho(usuarioId, sessionToken);
        return ResponseEntity.noContent().build();
    }
}

package com.vortex.vortex.modules.pedido.controller;

import com.vortex.vortex.modules.pedido.dto.CriarPedidoRequestDTO;
import com.vortex.vortex.modules.pedido.dto.MercadoPagoWebhookDTO;
import com.vortex.vortex.modules.pedido.dto.PedidoResponseDTO;
import com.vortex.vortex.modules.pedido.dto.TelemetriaRastreioResponseDTO;
import com.vortex.vortex.modules.pedido.service.PedidoService;
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
@RequestMapping("/api/v1/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<PedidoResponseDTO> criarPedido(
        @AuthenticationPrincipal String usuarioIdString,
        @Valid @RequestBody CriarPedidoRequestDTO dto
    ) {
        UUID usuarioId = UUID.fromString(usuarioIdString);
        PedidoResponseDTO response = pedidoService.criarPedido(usuarioId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/meus")
    public ResponseEntity<Page<PedidoResponseDTO>> listarMeusPedidos(
        @AuthenticationPrincipal String usuarioIdString,
        @PageableDefault(size = 10, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        UUID usuarioId = UUID.fromString(usuarioIdString);
        Page<PedidoResponseDTO> response = pedidoService.listarMeusPedidos(usuarioId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{idOuCodigo}")
    public ResponseEntity<PedidoResponseDTO> buscarPedido(@PathVariable String idOuCodigo) {
        PedidoResponseDTO response = pedidoService.buscarPorIdOuCodigo(idOuCodigo);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{idOuCodigo}/rastreio")
    public ResponseEntity<List<TelemetriaRastreioResponseDTO>> consultarRastreio(@PathVariable String idOuCodigo) {
        List<TelemetriaRastreioResponseDTO> response = pedidoService.consultarTelemetria(idOuCodigo);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/webhook/mercadopago")
    public ResponseEntity<Void> processarWebhook(@RequestBody MercadoPagoWebhookDTO webhook) {
        pedidoService.processarWebhookMercadoPago(webhook);
        return ResponseEntity.ok().build();
    }
}

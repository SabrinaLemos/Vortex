package com.vortex.vortex.modules.auth.controller;

import com.vortex.vortex.modules.auth.dto.AuthResponseDTO;
import com.vortex.vortex.modules.auth.dto.LoginRequestDTO;
import com.vortex.vortex.modules.auth.dto.NfcLoginRequestDTO;
import com.vortex.vortex.modules.auth.dto.RefreshTokenRequestDTO;
import com.vortex.vortex.modules.auth.dto.RegistroRequestDTO;
import com.vortex.vortex.modules.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/registrar")
    public ResponseEntity<AuthResponseDTO> registrar(@Valid @RequestBody RegistroRequestDTO dto) {
        AuthResponseDTO response = authService.registrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        AuthResponseDTO response = authService.login(dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/nfc-login")
    public ResponseEntity<AuthResponseDTO> nfcLogin(@Valid @RequestBody NfcLoginRequestDTO dto) {
        AuthResponseDTO response = authService.nfcLogin(dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDTO> refresh(@Valid @RequestBody RefreshTokenRequestDTO dto) {
        AuthResponseDTO response = authService.refresh(dto);
        return ResponseEntity.ok(response);
    }
}

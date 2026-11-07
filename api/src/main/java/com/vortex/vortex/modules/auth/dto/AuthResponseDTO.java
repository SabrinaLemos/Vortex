package com.vortex.vortex.modules.auth.dto;

import com.vortex.vortex.modules.usuario.dto.UsuarioResponseDTO;

public record AuthResponseDTO(
    String accessToken,
    String refreshToken,
    String tokenType,
    long expiresIn,
    UsuarioResponseDTO usuario
) {
    public static AuthResponseDTO bearer(String accessToken, String refreshToken, long expiresIn, UsuarioResponseDTO usuario) {
        return new AuthResponseDTO(accessToken, refreshToken, "Bearer", expiresIn, usuario);
    }
}

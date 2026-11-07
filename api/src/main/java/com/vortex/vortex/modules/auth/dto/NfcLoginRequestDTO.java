package com.vortex.vortex.modules.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record NfcLoginRequestDTO(
    @NotBlank(message = "O token da chave NFC é obrigatório")
    String tokenNfc
) {}

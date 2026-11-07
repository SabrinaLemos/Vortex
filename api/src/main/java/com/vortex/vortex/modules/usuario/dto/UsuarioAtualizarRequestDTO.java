package com.vortex.vortex.modules.usuario.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioAtualizarRequestDTO(
    @NotBlank(message = "O nome é obrigatório")
    @Size(max = 150, message = "O nome não pode exceder 150 caracteres")
    String nome,

    @Size(max = 25, message = "O telefone não pode exceder 25 caracteres")
    String telefone,

    @Size(max = 150, message = "A razão social não pode exceder 150 caracteres")
    String razaoSocial
) {}

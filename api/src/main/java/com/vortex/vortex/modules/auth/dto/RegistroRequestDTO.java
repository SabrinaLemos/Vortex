package com.vortex.vortex.modules.auth.dto;

import com.vortex.vortex.modules.usuario.enums.TipoContaUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistroRequestDTO(
    @NotBlank(message = "O nome é obrigatório")
    @Size(max = 150, message = "O nome não pode exceder 150 caracteres")
    String nome,

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "O formato do e-mail é inválido")
    @Size(max = 150, message = "O e-mail não pode exceder 150 caracteres")
    String email,

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
    String senha,

    @Size(max = 25, message = "O telefone não pode exceder 25 caracteres")
    String telefone,

    TipoContaUsuario tipoConta,

    @Size(max = 30, message = "O documento não pode exceder 30 caracteres")
    String documento,

    @Size(max = 150, message = "A razão social não pode exceder 150 caracteres")
    String razaoSocial
) {}

package com.vortex.vortex.modules.usuario.dto;

import com.vortex.vortex.modules.usuario.enums.PerfilAcesso;
import com.vortex.vortex.modules.usuario.enums.TipoContaUsuario;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record UsuarioResponseDTO(
    UUID id,
    String nome,
    String email,
    String telefone,
    TipoContaUsuario tipoConta,
    String documento,
    String razaoSocial,
    PerfilAcesso perfilAcesso,
    Boolean ativo,
    Boolean emailVerificado,
    String tokenNfcAuth,
    BigDecimal limiteCreditoB2b,
    Instant criadoEm
) {}

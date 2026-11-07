package com.vortex.vortex.modules.usuario.dto;

import com.vortex.vortex.modules.usuario.enums.TipoEndereco;

import java.time.Instant;
import java.util.UUID;

public record EnderecoResponseDTO(
    UUID id,
    String destinatario,
    String cep,
    String logradouro,
    String numero,
    String complemento,
    String bairro,
    String cidade,
    String uf,
    TipoEndereco tipo,
    Boolean padrao,
    Instant criadoEm
) {}

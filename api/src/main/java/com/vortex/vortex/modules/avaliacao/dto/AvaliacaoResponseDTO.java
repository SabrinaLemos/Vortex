package com.vortex.vortex.modules.avaliacao.dto;

import java.time.Instant;
import java.util.UUID;

public record AvaliacaoResponseDTO(
    UUID id,
    UUID produtoId,
    String nomeAutor,
    String organizacao,
    Integer nota,
    String comentario,
    String metodoValidacao,
    Boolean posseValidada,
    Boolean destaqueHome,
    Instant criadoEm
) {}

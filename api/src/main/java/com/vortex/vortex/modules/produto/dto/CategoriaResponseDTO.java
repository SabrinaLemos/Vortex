package com.vortex.vortex.modules.produto.dto;

import java.util.UUID;

public record CategoriaResponseDTO(
    UUID id,
    String slug,
    String nome,
    String descricao,
    String icone,
    Integer ordemExibicao
) {}

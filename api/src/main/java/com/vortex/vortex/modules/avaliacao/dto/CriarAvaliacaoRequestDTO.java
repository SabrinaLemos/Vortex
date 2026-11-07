package com.vortex.vortex.modules.avaliacao.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CriarAvaliacaoRequestDTO(
    @NotNull(message = "O ID do produto é obrigatório")
    UUID produtoId,

    @NotBlank(message = "O nome do autor é obrigatório")
    @Size(max = 100, message = "O nome não pode exceder 100 caracteres")
    String nomeAutor,

    @Size(max = 100, message = "A organização não pode exceder 100 caracteres")
    String organizacao,

    @NotNull(message = "A nota de avaliação é obrigatória")
    @Min(value = 1, message = "A nota mínima é 1 estrela")
    @Max(value = 5, message = "A nota máxima é 5 estrelas")
    Integer nota,

    @NotBlank(message = "O comentário é obrigatório")
    String comentario,

    String tokenNfcOuUid,

    String chaveNfe
) {}

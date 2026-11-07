package com.vortex.vortex.modules.proposta.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CriarPropostaB2bRequestDTO(
    @NotBlank(message = "O nome do responsável é obrigatório")
    @Size(max = 120, message = "O nome não pode exceder 120 caracteres")
    String nome,

    @NotBlank(message = "O nome da empresa é obrigatório")
    @Size(max = 150, message = "A empresa não pode exceder 150 caracteres")
    String empresa,

    @NotBlank(message = "O CNPJ é obrigatório")
    @Size(max = 30, message = "O CNPJ não pode exceder 30 caracteres")
    String cnpj,

    @NotBlank(message = "O e-mail corporativo é obrigatório")
    @Email(message = "Formato de e-mail inválido")
    @Size(max = 150, message = "O e-mail não pode exceder 150 caracteres")
    String email,

    @NotBlank(message = "O telefone ou WhatsApp é obrigatório")
    @Size(max = 25, message = "O telefone não pode exceder 25 caracteres")
    String telefone,

    @NotBlank(message = "A modalidade é obrigatória")
    @Size(max = 50, message = "A modalidade não pode exceder 50 caracteres")
    String modalidade,

    @NotBlank(message = "O volume estimado é obrigatório")
    @Size(max = 50, message = "O volume não pode exceder 50 caracteres")
    String volumeEstimado,

    @NotBlank(message = "A descrição do projeto é obrigatória")
    String descricao,

    Boolean incluiChipNfc,

    Boolean incluiGravacaoLaser
) {}

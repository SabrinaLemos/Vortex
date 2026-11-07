package com.vortex.vortex.modules.usuario.dto;

import com.vortex.vortex.modules.usuario.enums.TipoEndereco;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EnderecoRequestDTO(
    @NotBlank(message = "O destinatário é obrigatório")
    @Size(max = 120, message = "O destinatário não pode exceder 120 caracteres")
    String destinatario,

    @NotBlank(message = "O CEP é obrigatório")
    @Pattern(regexp = "^\\d{5}-?\\d{3}$", message = "CEP em formato inválido. Use 00000-000 ou 00000000")
    String cep,

    @NotBlank(message = "O logradouro é obrigatório")
    @Size(max = 200, message = "O logradouro não pode exceder 200 caracteres")
    String logradouro,

    @NotBlank(message = "O número é obrigatório")
    @Size(max = 20, message = "O número não pode exceder 20 caracteres")
    String numero,

    @Size(max = 100, message = "O complemento não pode exceder 100 caracteres")
    String complemento,

    @NotBlank(message = "O bairro é obrigatório")
    @Size(max = 100, message = "O bairro não pode exceder 100 caracteres")
    String bairro,

    @NotBlank(message = "A cidade é obrigatória")
    @Size(max = 100, message = "A cidade não pode exceder 100 caracteres")
    String cidade,

    @NotBlank(message = "A UF é obrigatória")
    @Size(min = 2, max = 2, message = "A UF deve conter exatamente 2 caracteres")
    String uf,

    TipoEndereco tipo,

    Boolean padrao
) {}

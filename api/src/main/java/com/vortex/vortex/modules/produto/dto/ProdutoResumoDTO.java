package com.vortex.vortex.modules.produto.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ProdutoResumoDTO(
    UUID id,
    String sku,
    String slug,
    String titulo,
    String descricaoCurta,
    String categoriaSlug,
    String categoriaNome,
    String rotuloCategoria,
    String tecnologia,
    String rotuloTecnologia,
    BigDecimal precoBase,
    String parcelamentoTexto,
    String imagemPrincipalUrl,
    Boolean possuiNfc,
    Boolean emEstoque,
    Boolean destaque,
    BigDecimal notaMedia,
    Integer totalAvaliacoes,
    List<VariacaoCorDTO> cores
) {}

package com.vortex.vortex.modules.produto.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ProdutoResponseDTO(
    UUID id,
    String sku,
    String slug,
    CategoriaResponseDTO categoria,
    String titulo,
    String subtitulo,
    String descricaoCurta,
    String descricaoCompleta,
    BigDecimal precoBase,
    String parcelamentoTexto,
    String tecnologia,
    String rotuloTecnologia,
    String rotuloCategoria,
    Boolean possuiNfc,
    String chipNfcPadrao,
    String toleranciaMilimetrica,
    String infillPadrao,
    String alturaCamadaPadrao,
    BigDecimal pesoGramas,
    String dimensoes,
    String imagemPrincipalUrl,
    Boolean emEstoque,
    Boolean destaque,
    BigDecimal notaMedia,
    Integer totalAvaliacoes,
    List<VariacaoMaterialDTO> materiais,
    List<VariacaoCorDTO> cores,
    Instant criadoEm
) {}

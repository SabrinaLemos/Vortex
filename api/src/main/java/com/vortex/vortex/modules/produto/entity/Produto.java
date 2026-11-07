package com.vortex.vortex.modules.produto.entity;

import com.vortex.vortex.modules.produto.enums.TecnologiaFabricacao;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "produtos")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 50)
    private String sku;

    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    @ToString.Exclude
    private CategoriaProduto categoria;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(length = 255)
    private String subtitulo;

    @Column(name = "descricao_curta", nullable = false, columnDefinition = "TEXT")
    private String descricaoCurta;

    @Column(name = "descricao_completa", nullable = false, columnDefinition = "TEXT")
    private String descricaoCompleta;

    @Column(name = "preco_base", nullable = false, precision = 10, scale = 2)
    private BigDecimal precoBase;

    @Column(name = "parcelamento_texto", length = 60)
    private String parcelamentoTexto;

    @Enumerated(EnumType.STRING)
    @Column(name = "tecnologia_fabricacao", nullable = false, length = 30)
    @Builder.Default
    private TecnologiaFabricacao tecnologiaFabricacao = TecnologiaFabricacao.FDM;

    @Column(name = "rotulo_tecnologia", length = 60)
    private String rotuloTecnologia;

    @Column(name = "rotulo_categoria", length = 60)
    private String rotuloCategoria;

    @Column(name = "possui_nfc", nullable = false)
    @Builder.Default
    private Boolean possuiNfc = false;

    @Column(name = "chip_nfc_padrao", length = 50)
    private String chipNfcPadrao;

    @Column(name = "tolerancia_milimetrica", length = 20)
    @Builder.Default
    private String toleranciaMilimetrica = "±0.08mm";

    @Column(name = "infill_padrao", length = 40)
    @Builder.Default
    private String infillPadrao = "25% Giroide";

    @Column(name = "altura_camada_padrao", length = 20)
    @Builder.Default
    private String alturaCamadaPadrao = "0.12mm";

    @Column(name = "peso_gramas", precision = 8, scale = 2)
    private BigDecimal pesoGramas;

    @Column(length = 60)
    private String dimensoes;

    @Column(name = "imagem_principal_url", nullable = false, length = 255)
    private String imagemPrincipalUrl;

    @Column(name = "em_estoque", nullable = false)
    @Builder.Default
    private Boolean emEstoque = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean destaque = false;

    @Column(name = "nota_media", precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal notaMedia = new BigDecimal("5.00");

    @Column(name = "total_avaliacoes", nullable = false)
    @Builder.Default
    private Integer totalAvaliacoes = 0;

    @OneToMany(mappedBy = "produto", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @Builder.Default
    private List<ProdutoVariacaoMaterial> variacoesMaterial = new ArrayList<>();

    @OneToMany(mappedBy = "produto", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @Builder.Default
    private List<ProdutoVariacaoCor> variacoesCor = new ArrayList<>();

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private Instant atualizadoEm;

    @PrePersist
    public void prePersist() {
        Instant agora = Instant.now();
        this.criadoEm = agora;
        this.atualizadoEm = agora;
        if (this.emEstoque == null) this.emEstoque = true;
        if (this.destaque == null) this.destaque = false;
        if (this.possuiNfc == null) this.possuiNfc = false;
        if (this.notaMedia == null) this.notaMedia = new BigDecimal("5.00");
        if (this.totalAvaliacoes == null) this.totalAvaliacoes = 0;
        if (this.toleranciaMilimetrica == null) this.toleranciaMilimetrica = "±0.08mm";
    }

    @PreUpdate
    public void preUpdate() {
        this.atualizadoEm = Instant.now();
    }
}

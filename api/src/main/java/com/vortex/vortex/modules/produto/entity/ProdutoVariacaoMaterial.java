package com.vortex.vortex.modules.produto.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
import java.util.UUID;

@Entity
@Table(name = "produtos_variacoes_material")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class ProdutoVariacaoMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    @ToString.Exclude
    private Produto produto;

    @Column(name = "chave_material", nullable = false, length = 30)
    private String chaveMaterial;

    @Column(name = "nome_exibicao", nullable = false, length = 60)
    private String nomeExibicao;

    @Column(name = "acrescimo_preco", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal acrescimoPreco = BigDecimal.ZERO;

    @Column(name = "descricao_tecnica", length = 200)
    private String descricaoTecnica;

    @Column(nullable = false)
    @Builder.Default
    private Boolean ativo = true;
}

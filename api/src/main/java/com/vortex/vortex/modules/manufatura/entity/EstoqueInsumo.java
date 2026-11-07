package com.vortex.vortex.modules.manufatura.entity;

import com.vortex.vortex.modules.manufatura.enums.CategoriaInsumo;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "estoque_insumos")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class EstoqueInsumo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 50)
    private String sku;

    @Column(nullable = false, length = 100)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(name = "categoria_insumo", nullable = false, length = 40)
    private CategoriaInsumo categoriaInsumo;

    @Column(length = 40)
    private String cor;

    @Column(name = "peso_liquido_gramas_total", precision = 10, scale = 2)
    private BigDecimal pesoLiquidoGramasTotal;

    @Column(name = "quantidade_unidades")
    private Integer quantidadeUnidades;

    @Column(name = "estoque_minimo_alerta", nullable = false, precision = 10, scale = 2)
    private BigDecimal estoqueMinimoAlerta;

    @Column(length = 100)
    private String fornecedor;

    @Column(nullable = false)
    @Builder.Default
    private Boolean ativo = true;

    @Column(name = "atualizado_em", nullable = false)
    private Instant atualizadoEm;

    @PrePersist
    @PreUpdate
    public void preUpdate() {
        this.atualizadoEm = Instant.now();
        if (this.ativo == null) this.ativo = true;
    }
}

package com.vortex.vortex.modules.carrinho.entity;

import com.vortex.vortex.modules.carrinho.enums.TipoCupom;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
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
@Table(name = "cupons_desconto")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class CupomDesconto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 40)
    private String codigo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoCupom tipo;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(name = "valor_minimo_pedido", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal valorMinimoPedido = BigDecimal.ZERO;

    @Column(name = "limite_usos")
    private Integer limiteUsos;

    @Column(name = "total_utilizado", nullable = false)
    @Builder.Default
    private Integer totalUtilizado = 0;

    @Column(name = "valido_ate")
    private Instant validoAte;

    @Column(nullable = false)
    @Builder.Default
    private Boolean ativo = true;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = Instant.now();
        if (this.ativo == null) this.ativo = true;
        if (this.totalUtilizado == null) this.totalUtilizado = 0;
        if (this.valorMinimoPedido == null) this.valorMinimoPedido = BigDecimal.ZERO;
    }
}

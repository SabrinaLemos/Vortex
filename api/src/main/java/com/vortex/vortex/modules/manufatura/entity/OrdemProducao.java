package com.vortex.vortex.modules.manufatura.entity;

import com.vortex.vortex.modules.manufatura.enums.StatusOrdemProducao;
import com.vortex.vortex.modules.pedido.entity.ItemPedido;
import com.vortex.vortex.modules.pedido.entity.Pedido;
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
import java.util.UUID;

@Entity
@Table(name = "ordens_producao")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class OrdemProducao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "codigo_os", nullable = false, unique = true, length = 30)
    private String codigoOs;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
    @ToString.Exclude
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_pedido_id")
    @ToString.Exclude
    private ItemPedido itemPedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maquina_id")
    @ToString.Exclude
    private MaquinaImpressao maquina;

    @Column(name = "cliente_descricao", nullable = false, length = 150)
    private String clienteDescricao;

    @Column(name = "produto_descricao", nullable = false, length = 150)
    private String produtoDescricao;

    @Column(name = "quantidade_planejada", nullable = false)
    private Integer quantidadePlanejada;

    @Column(name = "quantidade_produzida", nullable = false)
    @Builder.Default
    private Integer quantidadeProduzida = 0;

    @Column(name = "arquivo_gcode_path", length = 255)
    private String arquivoGcodePath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private StatusOrdemProducao status = StatusOrdemProducao.FILA_FATIAMENTO;

    @Column(name = "material_utilizado", length = 60)
    private String materialUtilizado;

    @Column(name = "peso_filamento_estimado_gramas", precision = 8, scale = 2)
    private BigDecimal pesoFilamentoEstimadoGramas;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private Instant atualizadoEm;

    @PrePersist
    public void prePersist() {
        Instant agora = Instant.now();
        this.criadoEm = agora;
        this.atualizadoEm = agora;
        if (this.status == null) this.status = StatusOrdemProducao.FILA_FATIAMENTO;
        if (this.quantidadeProduzida == null) this.quantidadeProduzida = 0;
    }

    @PreUpdate
    public void preUpdate() {
        this.atualizadoEm = Instant.now();
    }
}

package com.vortex.vortex.modules.pedido.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
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
@Table(name = "telemetria_rastreio")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class TelemetriaRastreio {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    @ToString.Exclude
    private Pedido pedido;

    @Column(name = "codigo_rastreio", nullable = false, length = 50)
    private String codigoRastreio;

    @Column(name = "temperatura_celsius", precision = 4, scale = 1)
    private BigDecimal temperaturaCelsius;

    @Column(name = "acelerometro_g_force", precision = 4, scale = 2)
    private BigDecimal acelerometroGForce;

    @Column(name = "bateria_dispositivo_percentual")
    private Integer bateriaDispositivoPercentual;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "ultimo_hub", length = 120)
    private String ultimoHub;

    @Column(name = "descricao_evento", nullable = false, length = 255)
    private String descricaoEvento;

    @Column(name = "registrado_em", nullable = false, updatable = false)
    private Instant registradoEm;

    @PrePersist
    public void prePersist() {
        this.registradoEm = Instant.now();
    }
}

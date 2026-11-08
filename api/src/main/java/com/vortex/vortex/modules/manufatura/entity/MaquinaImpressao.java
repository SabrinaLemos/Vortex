package com.vortex.vortex.modules.manufatura.entity;

import com.vortex.vortex.modules.manufatura.enums.StatusMaquina;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "maquinas_impressao")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class MaquinaImpressao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nome_identificador", nullable = false, unique = true, length = 80)
    private String nomeIdentificador;

    @Column(nullable = false, length = 30)
    private String tecnologia;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private StatusMaquina status = StatusMaquina.OCIOSA;

    @Column(name = "temperatura_bico_celsius", precision = 5, scale = 1)
    private BigDecimal temperaturaBicoCelsius;

    @Column(name = "temperatura_mesa_celsius", precision = 5, scale = 1)
    private BigDecimal temperaturaMesaCelsius;

    @Column(name = "nozzle_diametro", length = 30)
    @Builder.Default
    private String nozzleDiametro = "0.4mm";

    @Column(name = "camada_atual")
    @Builder.Default
    private Integer camadaAtual = 0;

    @Column(name = "total_camadas")
    @Builder.Default
    private Integer totalCamadas = 0;

    @Column(name = "tempo_restante_minutos")
    @Builder.Default
    private Integer tempoRestanteMinutos = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean ativo = true;
}

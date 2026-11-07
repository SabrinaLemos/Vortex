package com.vortex.vortex.modules.proposta.entity;

import com.vortex.vortex.modules.proposta.enums.StatusPropostaB2b;
import com.vortex.vortex.modules.usuario.entity.Usuario;
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
@Table(name = "propostas_b2b")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class PropostaB2b {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    @ToString.Exclude
    private Usuario usuario;

    @Column(name = "codigo_proposta", nullable = false, unique = true, length = 30)
    private String codigoProposta;

    @Column(name = "nome_responsavel", nullable = false, length = 120)
    private String nomeResponsavel;

    @Column(nullable = false, length = 150)
    private String empresa;

    @Column(nullable = false, length = 30)
    private String cnpj;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(nullable = false, length = 25)
    private String telefone;

    @Column(nullable = false, length = 50)
    private String modalidade;

    @Column(name = "volume_estimado", nullable = false, length = 50)
    private String volumeEstimado;

    @Column(name = "descricao_projeto", nullable = false, columnDefinition = "TEXT")
    private String descricaoProjeto;

    @Column(name = "inclui_chip_nfc", nullable = false)
    @Builder.Default
    private Boolean incluiChipNfc = false;

    @Column(name = "inclui_gravacao_laser", nullable = false)
    @Builder.Default
    private Boolean incluiGravacaoLaser = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private StatusPropostaB2b status = StatusPropostaB2b.RECEBIDA;

    @Column(name = "valor_total_estimado", precision = 12, scale = 2)
    private BigDecimal valorTotalEstimado;

    @Column(name = "prazo_dias_estimado")
    private Integer prazoDiasEstimado;

    @Column(name = "engenheiro_responsavel", length = 100)
    private String engenheiroResponsavel;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private Instant atualizadoEm;

    @PrePersist
    public void prePersist() {
        Instant agora = Instant.now();
        this.criadoEm = agora;
        this.atualizadoEm = agora;
        if (this.status == null) this.status = StatusPropostaB2b.RECEBIDA;
        if (this.incluiChipNfc == null) this.incluiChipNfc = false;
        if (this.incluiGravacaoLaser == null) this.incluiGravacaoLaser = false;
    }

    @PreUpdate
    public void preUpdate() {
        this.atualizadoEm = Instant.now();
    }
}

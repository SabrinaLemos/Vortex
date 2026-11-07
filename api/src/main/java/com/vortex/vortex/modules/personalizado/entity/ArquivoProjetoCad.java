package com.vortex.vortex.modules.personalizado.entity;

import com.vortex.vortex.modules.usuario.entity.Usuario;
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
@Table(name = "arquivos_projeto_cad")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class ArquivoProjetoCad {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    @ToString.Exclude
    private Usuario usuario;

    @Column(name = "nome_arquivo_original", nullable = false, length = 255)
    private String nomeArquivoOriginal;

    @Column(name = "tamanho_bytes", nullable = false)
    private Long tamanhoBytes;

    @Column(nullable = false, length = 10)
    private String extensao;

    @Column(name = "storage_path", nullable = false, length = 500)
    private String storagePath;

    @Column(name = "storage_provider", nullable = false, length = 30)
    @Builder.Default
    private String storageProvider = "LOCAL";

    @Column(name = "volume_cm3", precision = 8, scale = 2)
    private BigDecimal volumeCm3;

    @Column(name = "dimensoes_bounding_box", length = 60)
    private String dimensoesBoundingBox;

    @Column(name = "altura_camada_solicitada", length = 20)
    @Builder.Default
    private String alturaCamadaSolicitada = "0.20mm";

    @Column(name = "infill_solicitado", length = 30)
    @Builder.Default
    private String infillSolicitado = "Giroide";

    @Column(name = "material_solicitado", length = 30)
    @Builder.Default
    private String materialSolicitado = "PLA";

    @Column(name = "cor_solicitada", length = 40)
    private String corSolicitada;

    @Column(name = "possui_chip_nfc")
    @Builder.Default
    private Boolean possuiChipNfc = false;

    @Column(name = "payload_nfc", length = 255)
    private String payloadNfc;

    @Column(name = "briefing_cliente", columnDefinition = "TEXT")
    private String briefingCliente;

    @Column(name = "orcamento_estimado", precision = 10, scale = 2)
    private BigDecimal orcamentoEstimado;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = Instant.now();
        if (this.storageProvider == null) this.storageProvider = "LOCAL";
        if (this.possuiChipNfc == null) this.possuiChipNfc = false;
        if (this.alturaCamadaSolicitada == null) this.alturaCamadaSolicitada = "0.20mm";
        if (this.infillSolicitado == null) this.infillSolicitado = "Giroide";
        if (this.materialSolicitado == null) this.materialSolicitado = "PLA";
    }
}

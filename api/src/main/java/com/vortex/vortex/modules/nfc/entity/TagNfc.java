package com.vortex.vortex.modules.nfc.entity;

import com.vortex.vortex.modules.nfc.enums.LockBitStatus;
import com.vortex.vortex.modules.nfc.enums.TipoChipNfc;
import com.vortex.vortex.modules.usuario.entity.Usuario;
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

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tags_nfc")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class TagNfc {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 40)
    private String uid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_titular_id")
    @ToString.Exclude
    private Usuario usuarioTitular;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_chip", nullable = false, length = 30)
    @Builder.Default
    private TipoChipNfc tipoChip = TipoChipNfc.NTAG213;

    @Column(length = 100)
    private String apelido;

    @Column(name = "slug_redirecionamento", unique = true, length = 100)
    private String slugRedirecionamento;

    @Column(name = "url_destino", nullable = false, length = 500)
    private String urlDestino;

    @Enumerated(EnumType.STRING)
    @Column(name = "lock_bit_status", nullable = false, length = 30)
    @Builder.Default
    private LockBitStatus lockBitStatus = LockBitStatus.PROTEGIDO_SENHA;

    @Column(name = "chave_assinatura_ecdsa", length = 255)
    private String chaveAssinaturaEcdsa;

    @Column(name = "contagem_toques", nullable = false)
    @Builder.Default
    private Integer contagemToques = 0;

    @Column(name = "ultimo_toque_em")
    private Instant ultimoToqueEm;

    @Column(nullable = false)
    @Builder.Default
    private Boolean ativo = true;

    @OneToMany(mappedBy = "tagNfc", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @Builder.Default
    private List<HistoricoToqueNfc> historicoToques = new ArrayList<>();

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private Instant atualizadoEm;

    @PrePersist
    public void prePersist() {
        Instant agora = Instant.now();
        this.criadoEm = agora;
        this.atualizadoEm = agora;
        if (this.ativo == null) this.ativo = true;
        if (this.contagemToques == null) this.contagemToques = 0;
        if (this.tipoChip == null) this.tipoChip = TipoChipNfc.NTAG213;
        if (this.lockBitStatus == null) this.lockBitStatus = LockBitStatus.PROTEGIDO_SENHA;
    }

    @PreUpdate
    public void preUpdate() {
        this.atualizadoEm = Instant.now();
    }
}

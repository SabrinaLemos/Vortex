package com.vortex.vortex.modules.avaliacao.entity;

import com.vortex.vortex.modules.nfc.entity.TagNfc;
import com.vortex.vortex.modules.produto.entity.Produto;
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

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "avaliacoes_produto")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class AvaliacaoProduto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    @ToString.Exclude
    private Produto produto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    @ToString.Exclude
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_nfc_id")
    @ToString.Exclude
    private TagNfc tagNfc;

    @Column(name = "nome_autor", nullable = false, length = 100)
    private String nomeAutor;

    @Column(length = 100)
    private String organizacao;

    @Column(nullable = false)
    private Integer nota;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "metodo_validacao", nullable = false, length = 30)
    @Builder.Default
    private String metodoValidacao = "CHIP_NFC";

    @Column(name = "posse_validada", nullable = false)
    @Builder.Default
    private Boolean posseValidada = true;

    @Column(name = "aprovado_moderacao", nullable = false)
    @Builder.Default
    private Boolean aprovadoModeracao = true;

    @Column(name = "destaque_home", nullable = false)
    @Builder.Default
    private Boolean destaqueHome = false;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = Instant.now();
        if (this.metodoValidacao == null) this.metodoValidacao = "CHIP_NFC";
        if (this.posseValidada == null) this.posseValidada = true;
        if (this.aprovadoModeracao == null) this.aprovadoModeracao = true;
        if (this.destaqueHome == null) this.destaqueHome = false;
    }
}

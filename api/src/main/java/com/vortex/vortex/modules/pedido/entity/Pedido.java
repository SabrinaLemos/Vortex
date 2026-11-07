package com.vortex.vortex.modules.pedido.entity;

import com.vortex.vortex.modules.carrinho.entity.CupomDesconto;
import com.vortex.vortex.modules.pedido.enums.MetodoPagamento;
import com.vortex.vortex.modules.pedido.enums.ModalidadeFrete;
import com.vortex.vortex.modules.pedido.enums.StatusPagamento;
import com.vortex.vortex.modules.pedido.enums.StatusPedido;
import com.vortex.vortex.modules.usuario.entity.EnderecoUsuario;
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

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "pedidos")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "codigo_ordem", nullable = false, unique = true, length = 30)
    private String codigoOrdem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @ToString.Exclude
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "endereco_entrega_id")
    @ToString.Exclude
    private EnderecoUsuario enderecoEntrega;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cupom_id")
    @ToString.Exclude
    private CupomDesconto cupom;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private StatusPedido status = StatusPedido.AGUARDANDO_PAGAMENTO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal desconto = BigDecimal.ZERO;

    @Column(name = "valor_frete", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal valorFrete = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pagamento", nullable = false, length = 30)
    private MetodoPagamento metodoPagamento;

    @Column(nullable = false)
    @Builder.Default
    private Integer parcelas = 1;

    @Column(name = "id_transacao_gateway", length = 100)
    private String idTransacaoGateway;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_pagamento", length = 30)
    @Builder.Default
    private StatusPagamento statusPagamento = StatusPagamento.PENDENTE;

    @Column(name = "qr_code_pix", columnDefinition = "TEXT")
    private String qrCodePix;

    @Column(name = "qr_code_pix_url", columnDefinition = "TEXT")
    private String qrCodePixUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "modalidade_frete", nullable = false, length = 40)
    private ModalidadeFrete modalidadeFrete;

    @Column(name = "prazo_estimado_entrega", length = 50)
    private String prazoEstimadoEntrega;

    @Column(name = "observacoes_producao", columnDefinition = "TEXT")
    private String observacoesProducao;

    @Column(name = "chave_acesso_nfe", length = 50)
    private String chaveAcessoNfe;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @Builder.Default
    private List<ItemPedido> itens = new ArrayList<>();

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @Builder.Default
    private List<TelemetriaRastreio> eventosRastreio = new ArrayList<>();

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private Instant atualizadoEm;

    @PrePersist
    public void prePersist() {
        Instant agora = Instant.now();
        this.criadoEm = agora;
        this.atualizadoEm = agora;
        if (this.status == null) this.status = StatusPedido.AGUARDANDO_PAGAMENTO;
        if (this.statusPagamento == null) this.statusPagamento = StatusPagamento.PENDENTE;
        if (this.parcelas == null) this.parcelas = 1;
        if (this.desconto == null) this.desconto = BigDecimal.ZERO;
        if (this.valorFrete == null) this.valorFrete = BigDecimal.ZERO;
    }

    @PreUpdate
    public void preUpdate() {
        this.atualizadoEm = Instant.now();
    }
}

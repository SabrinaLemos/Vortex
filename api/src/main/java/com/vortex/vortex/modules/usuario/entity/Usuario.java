package com.vortex.vortex.modules.usuario.entity;

import com.vortex.vortex.modules.usuario.enums.PerfilAcesso;
import com.vortex.vortex.modules.usuario.enums.ProvedorOAuth;
import com.vortex.vortex.modules.usuario.enums.TipoContaUsuario;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "usuarios")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "senha_hash", length = 255)
    private String senhaHash;

    @Column(length = 25)
    private String telefone;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_conta", nullable = false, length = 20)
    @Builder.Default
    private TipoContaUsuario tipoConta = TipoContaUsuario.PF;

    @Column(unique = true, length = 30)
    private String documento;

    @Column(name = "razao_social", length = 150)
    private String razaoSocial;

    @Enumerated(EnumType.STRING)
    @Column(name = "perfil_acesso", nullable = false, length = 25)
    @Builder.Default
    private PerfilAcesso perfilAcesso = PerfilAcesso.CLIENTE;

    @Column(nullable = false)
    @Builder.Default
    private Boolean ativo = true;

    @Column(name = "email_verificado", nullable = false)
    @Builder.Default
    private Boolean emailVerificado = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "provedor_oauth", length = 30)
    @Builder.Default
    private ProvedorOAuth provedorOauth = ProvedorOAuth.LOCAL;

    @Column(name = "id_oauth", length = 100)
    private String idOauth;

    @Column(name = "token_nfc_auth", unique = true, length = 120)
    private String tokenNfcAuth;

    @Column(name = "limite_credito_b2b", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal limiteCreditoB2b = BigDecimal.ZERO;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @Builder.Default
    private List<EnderecoUsuario> enderecos = new ArrayList<>();

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
        if (this.emailVerificado == null) this.emailVerificado = false;
        if (this.tipoConta == null) this.tipoConta = TipoContaUsuario.PF;
        if (this.perfilAcesso == null) this.perfilAcesso = PerfilAcesso.CLIENTE;
        if (this.provedorOauth == null) this.provedorOauth = ProvedorOAuth.LOCAL;
        if (this.limiteCreditoB2b == null) this.limiteCreditoB2b = BigDecimal.ZERO;
    }

    @PreUpdate
    public void preUpdate() {
        this.atualizadoEm = Instant.now();
    }
}

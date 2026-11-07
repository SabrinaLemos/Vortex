package com.vortex.vortex.modules.auth.support;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.vortex.vortex.common.exception.UnauthorizedException;
import com.vortex.vortex.modules.usuario.entity.Usuario;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Component
public class JwtTokenSupport {

    private final byte[] secretKeyBytes;
    private final long expirationMs;
    private final long refreshExpirationMs;

    public JwtTokenSupport(
        @Value("${vortex.jwt.secret}") String secret,
        @Value("${vortex.jwt.expiration-ms:86400000}") long expirationMs,
        @Value("${vortex.jwt.refresh-expiration-ms:2592000000}") long refreshExpirationMs
    ) {
        this.secretKeyBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationMs = expirationMs;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    public String gerarAccessToken(Usuario usuario) {
        try {
            JWSSigner signer = new MACSigner(secretKeyBytes);
            Date agora = new Date();
            Date expiracao = new Date(agora.getTime() + expirationMs);

            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(usuario.getId().toString())
                .issuer("vortex-api")
                .issueTime(agora)
                .expirationTime(expiracao)
                .claim("email", usuario.getEmail())
                .claim("nome", usuario.getNome())
                .claim("perfil", usuario.getPerfilAcesso().name())
                .claim("tipoConta", usuario.getTipoConta().name())
                .build();

            SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet);
            signedJWT.sign(signer);
            return signedJWT.serialize();
        } catch (Exception e) {
            log.error("Erro ao gerar access token JWT: ", e);
            throw new RuntimeException("Falha ao gerar credencial de acesso", e);
        }
    }

    public String gerarRefreshToken(Usuario usuario) {
        try {
            JWSSigner signer = new MACSigner(secretKeyBytes);
            Date agora = new Date();
            Date expiracao = new Date(agora.getTime() + refreshExpirationMs);

            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(usuario.getId().toString())
                .issuer("vortex-api")
                .issueTime(agora)
                .expirationTime(expiracao)
                .claim("type", "refresh")
                .build();

            SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet);
            signedJWT.sign(signer);
            return signedJWT.serialize();
        } catch (Exception e) {
            log.error("Erro ao gerar refresh token JWT: ", e);
            throw new RuntimeException("Falha ao gerar credencial de renovação", e);
        }
    }

    public UUID extrairUsuarioId(String token) {
        JWTClaimsSet claims = validarETrazerClaims(token);
        return UUID.fromString(claims.getSubject());
    }

    public JWTClaimsSet validarETrazerClaims(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(secretKeyBytes);

            if (!signedJWT.verify(verifier)) {
                throw new UnauthorizedException("Assinatura de token JWT inválida");
            }

            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
            Date expiracao = claims.getExpirationTime();

            if (expiracao == null || expiracao.before(new Date())) {
                throw new UnauthorizedException("Token JWT expirado");
            }

            return claims;
        } catch (UnauthorizedException ue) {
            throw ue;
        } catch (Exception e) {
            log.warn("Falha na validação do token JWT: {}", e.getMessage());
            throw new UnauthorizedException("Token de acesso inválido ou malformado");
        }
    }

    public long getExpirationMs() {
        return expirationMs;
    }
}

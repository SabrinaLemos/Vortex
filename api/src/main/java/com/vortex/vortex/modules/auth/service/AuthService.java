package com.vortex.vortex.modules.auth.service;

import com.vortex.vortex.modules.auth.dto.AuthResponseDTO;
import com.vortex.vortex.modules.auth.dto.LoginRequestDTO;
import com.vortex.vortex.modules.auth.dto.NfcLoginRequestDTO;
import com.vortex.vortex.modules.auth.dto.RefreshTokenRequestDTO;
import com.vortex.vortex.modules.auth.dto.RegistroRequestDTO;
import com.vortex.vortex.modules.auth.mapper.AuthMapper;
import com.vortex.vortex.modules.auth.support.JwtTokenSupport;
import com.vortex.vortex.modules.auth.support.PasswordEncoderSupport;
import com.vortex.vortex.modules.auth.validator.AuthValidator;
import com.vortex.vortex.modules.usuario.dto.UsuarioResponseDTO;
import com.vortex.vortex.modules.usuario.entity.Usuario;
import com.vortex.vortex.modules.usuario.finder.UsuarioFinder;
import com.vortex.vortex.modules.usuario.mapper.UsuarioMapper;
import com.vortex.vortex.modules.usuario.repository.UsuarioRepository;
import com.vortex.vortex.modules.usuario.validator.UsuarioValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioFinder usuarioFinder;
    private final UsuarioValidator usuarioValidator;
    private final AuthValidator authValidator;
    private final AuthMapper authMapper;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoderSupport passwordEncoderSupport;
    private final JwtTokenSupport jwtTokenSupport;

    @Transactional
    public AuthResponseDTO registrar(RegistroRequestDTO dto) {
        usuarioValidator.validarNovoEmail(dto.email());
        usuarioValidator.validarNovoDocumento(dto.documento());
        usuarioValidator.validarForcaSenha(dto.senha());

        String senhaCriptografada = passwordEncoderSupport.encode(dto.senha());
        Usuario novoUsuario = authMapper.toEntity(dto, senhaCriptografada);
        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

        log.info("Novo usuário registrado com sucesso: {} [{}]", usuarioSalvo.getEmail(), usuarioSalvo.getId());

        String accessToken = jwtTokenSupport.gerarAccessToken(usuarioSalvo);
        String refreshToken = jwtTokenSupport.gerarRefreshToken(usuarioSalvo);
        UsuarioResponseDTO usuarioDTO = usuarioMapper.toResponseDTO(usuarioSalvo);

        return AuthResponseDTO.bearer(accessToken, refreshToken, jwtTokenSupport.getExpirationMs(), usuarioDTO);
    }

    @Transactional(readOnly = true)
    public AuthResponseDTO login(LoginRequestDTO dto) {
        Usuario usuario = usuarioFinder.findByEmail(dto.email().toLowerCase().trim());
        authValidator.validarUsuarioAtivo(usuario);
        authValidator.validarSenha(dto.senha(), usuario.getSenhaHash());

        log.info("Usuário autenticado com sucesso: {}", usuario.getEmail());

        String accessToken = jwtTokenSupport.gerarAccessToken(usuario);
        String refreshToken = jwtTokenSupport.gerarRefreshToken(usuario);
        UsuarioResponseDTO usuarioDTO = usuarioMapper.toResponseDTO(usuario);

        return AuthResponseDTO.bearer(accessToken, refreshToken, jwtTokenSupport.getExpirationMs(), usuarioDTO);
    }

    @Transactional(readOnly = true)
    public AuthResponseDTO nfcLogin(NfcLoginRequestDTO dto) {
        Usuario usuario = usuarioFinder.findByTokenNfcAuth(dto.tokenNfc().trim());
        authValidator.validarUsuarioAtivo(usuario);

        log.info("Usuário autenticado com sucesso via Hardware Key NFC: {} [{}]", usuario.getEmail(), usuario.getId());

        String accessToken = jwtTokenSupport.gerarAccessToken(usuario);
        String refreshToken = jwtTokenSupport.gerarRefreshToken(usuario);
        UsuarioResponseDTO usuarioDTO = usuarioMapper.toResponseDTO(usuario);

        return AuthResponseDTO.bearer(accessToken, refreshToken, jwtTokenSupport.getExpirationMs(), usuarioDTO);
    }

    @Transactional(readOnly = true)
    public AuthResponseDTO refresh(RefreshTokenRequestDTO dto) {
        UUID usuarioId = jwtTokenSupport.extrairUsuarioId(dto.refreshToken());
        Usuario usuario = usuarioFinder.findById(usuarioId);
        authValidator.validarUsuarioAtivo(usuario);

        log.info("Sessão renovada para o usuário: {}", usuario.getEmail());

        String novoAccessToken = jwtTokenSupport.gerarAccessToken(usuario);
        String novoRefreshToken = jwtTokenSupport.gerarRefreshToken(usuario);
        UsuarioResponseDTO usuarioDTO = usuarioMapper.toResponseDTO(usuario);

        return AuthResponseDTO.bearer(novoAccessToken, novoRefreshToken, jwtTokenSupport.getExpirationMs(), usuarioDTO);
    }
}

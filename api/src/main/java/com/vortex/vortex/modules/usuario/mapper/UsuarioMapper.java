package com.vortex.vortex.modules.usuario.mapper;

import com.vortex.vortex.modules.usuario.dto.UsuarioResponseDTO;
import com.vortex.vortex.modules.usuario.entity.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        if (usuario == null) return null;
        return new UsuarioResponseDTO(
            usuario.getId(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getTelefone(),
            usuario.getTipoConta(),
            usuario.getDocumento(),
            usuario.getRazaoSocial(),
            usuario.getPerfilAcesso(),
            usuario.getAtivo(),
            usuario.getEmailVerificado(),
            usuario.getTokenNfcAuth(),
            usuario.getLimiteCreditoB2b(),
            usuario.getCriadoEm()
        );
    }
}

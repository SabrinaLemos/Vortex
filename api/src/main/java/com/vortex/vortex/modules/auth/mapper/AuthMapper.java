package com.vortex.vortex.modules.auth.mapper;

import com.vortex.vortex.modules.auth.dto.RegistroRequestDTO;
import com.vortex.vortex.modules.usuario.entity.Usuario;
import com.vortex.vortex.modules.usuario.enums.PerfilAcesso;
import com.vortex.vortex.modules.usuario.enums.ProvedorOAuth;
import com.vortex.vortex.modules.usuario.enums.TipoContaUsuario;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class AuthMapper {

    public Usuario toEntity(RegistroRequestDTO dto, String senhaCriptografada) {
        if (dto == null) return null;
        return Usuario.builder()
            .nome(dto.nome())
            .email(dto.email().toLowerCase().trim())
            .senhaHash(senhaCriptografada)
            .telefone(dto.telefone())
            .tipoConta(dto.tipoConta() != null ? dto.tipoConta() : TipoContaUsuario.PF)
            .documento(dto.documento() != null ? dto.documento().replaceAll("\\D", "") : null)
            .razaoSocial(dto.razaoSocial())
            .perfilAcesso(PerfilAcesso.CLIENTE)
            .provedorOauth(ProvedorOAuth.LOCAL)
            .ativo(true)
            .emailVerificado(false)
            .limiteCreditoB2b(BigDecimal.ZERO)
            .build();
    }
}

package com.vortex.vortex.modules.auth.validator;

import com.vortex.vortex.common.exception.UnauthorizedException;
import com.vortex.vortex.modules.auth.support.PasswordEncoderSupport;
import com.vortex.vortex.modules.usuario.entity.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthValidator {

    private final PasswordEncoderSupport passwordEncoderSupport;

    public void validarSenha(String senhaInformada, String senhaHashArmazenada) {
        if (!passwordEncoderSupport.matches(senhaInformada, senhaHashArmazenada)) {
            throw new UnauthorizedException("Credenciais inválidas. Verifique seu e-mail e senha.");
        }
    }

    public void validarUsuarioAtivo(Usuario usuario) {
        if (!Boolean.TRUE.equals(usuario.getAtivo())) {
            throw new UnauthorizedException("Esta conta de usuário está inativa. Entre em contato com o suporte.");
        }
    }
}

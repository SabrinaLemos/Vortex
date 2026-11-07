package com.vortex.vortex.modules.personalizado.validator;

import com.vortex.vortex.common.exception.BadRequestException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Component
public class ArquivoProjetoCadValidator {

    private static final Set<String> EXTENSOES_PERMITIDAS = Set.of("STL", "STEP", "STP", "OBJ", "3MF");
    private static final long TAMANHO_MAXIMO_BYTES = 50 * 1024 * 1024; // 50MB

    public void validarArquivo(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("O arquivo de projeto CAD é obrigatório.");
        }

        if (file.getSize() > TAMANHO_MAXIMO_BYTES) {
            throw new BadRequestException("O arquivo excede o limite máximo permitido de 50MB.");
        }

        String nomeOriginal = file.getOriginalFilename();
        if (nomeOriginal == null || !nomeOriginal.contains(".")) {
            throw new BadRequestException("Nome de arquivo inválido ou sem extensão.");
        }

        String extensao = nomeOriginal.substring(nomeOriginal.lastIndexOf(".") + 1).toUpperCase();
        if (!EXTENSOES_PERMITIDAS.contains(extensao)) {
            throw new BadRequestException("Extensão de arquivo não suportada. Envie arquivos .STL, .STEP, .OBJ ou .3MF.");
        }
    }
}

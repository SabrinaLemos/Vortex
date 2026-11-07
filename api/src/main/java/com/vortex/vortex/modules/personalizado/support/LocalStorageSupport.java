package com.vortex.vortex.modules.personalizado.support;

import com.vortex.vortex.common.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Component
public class LocalStorageSupport {

    private final Path uploadDir;

    public LocalStorageSupport(@Value("${vortex.storage.local-dir:./uploads/cad}") String dir) {
        this.uploadDir = Paths.get(dir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            log.error("Não foi possível criar o diretório de uploads CAD: {}", this.uploadDir, e);
            throw new RuntimeException("Falha ao inicializar o diretório de armazenamento local", e);
        }
    }

    public String armazenarArquivo(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("O arquivo enviado está vazio.");
        }

        String nomeOriginal = file.getOriginalFilename();
        String extensao = "";
        if (nomeOriginal != null && nomeOriginal.contains(".")) {
            extensao = nomeOriginal.substring(nomeOriginal.lastIndexOf("."));
        }

        String nomeSeguro = UUID.randomUUID() + extensao;
        Path destino = this.uploadDir.resolve(nomeSeguro);

        try {
            Files.copy(file.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
            log.info("Arquivo CAD armazenado com sucesso em: {}", destino);
            return destino.toString();
        } catch (IOException e) {
            log.error("Erro ao salvar arquivo no disco local: ", e);
            throw new RuntimeException("Falha ao persistir o arquivo CAD no disco", e);
        }
    }
}

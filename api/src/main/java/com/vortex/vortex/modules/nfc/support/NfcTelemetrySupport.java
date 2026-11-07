package com.vortex.vortex.modules.nfc.support;

import com.vortex.vortex.modules.nfc.entity.HistoricoToqueNfc;
import com.vortex.vortex.modules.nfc.entity.TagNfc;
import com.vortex.vortex.modules.nfc.repository.HistoricoToqueNfcRepository;
import com.vortex.vortex.modules.nfc.repository.TagNfcRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Slf4j
@Component
@RequiredArgsConstructor
public class NfcTelemetrySupport {

    private final TagNfcRepository tagNfcRepository;
    private final HistoricoToqueNfcRepository historicoToqueNfcRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void registrarToque(TagNfc tag, String ipOrigem, String userAgent) {
        tag.setContagemToques(tag.getContagemToques() + 1);
        tag.setUltimoToqueEm(Instant.now());
        tagNfcRepository.save(tag);

        HistoricoToqueNfc historico = HistoricoToqueNfc.builder()
            .tagNfc(tag)
            .ipOrigem(ipOrigem)
            .userAgent(userAgent)
            .registradoEm(Instant.now())
            .build();

        historicoToqueNfcRepository.save(historico);
        log.info("Toque NFC registrado para Tag UID: {} (Total: {})", tag.getUid(), tag.getContagemToques());
    }
}

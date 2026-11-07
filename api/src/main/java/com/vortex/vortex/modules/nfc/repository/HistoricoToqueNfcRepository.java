package com.vortex.vortex.modules.nfc.repository;

import com.vortex.vortex.modules.nfc.entity.HistoricoToqueNfc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HistoricoToqueNfcRepository extends JpaRepository<HistoricoToqueNfc, UUID> {

    List<HistoricoToqueNfc> findTop50ByTagNfcIdOrderByRegistradoEmDesc(UUID tagNfcId);
}

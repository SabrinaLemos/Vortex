package com.vortex.vortex.modules.nfc.repository;

import com.vortex.vortex.modules.nfc.entity.TagNfc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TagNfcRepository extends JpaRepository<TagNfc, UUID> {

    Optional<TagNfc> findByUid(String uid);

    Optional<TagNfc> findBySlugRedirecionamento(String slugRedirecionamento);

    List<TagNfc> findByUsuarioTitularIdOrderByCriadoEmDesc(UUID usuarioTitularId);

    boolean existsByUid(String uid);

    boolean existsBySlugRedirecionamento(String slugRedirecionamento);
}

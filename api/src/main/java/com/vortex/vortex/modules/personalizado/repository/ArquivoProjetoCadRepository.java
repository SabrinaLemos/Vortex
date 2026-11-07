package com.vortex.vortex.modules.personalizado.repository;

import com.vortex.vortex.modules.personalizado.entity.ArquivoProjetoCad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ArquivoProjetoCadRepository extends JpaRepository<ArquivoProjetoCad, UUID> {

    List<ArquivoProjetoCad> findByUsuarioIdOrderByCriadoEmDesc(UUID usuarioId);
}

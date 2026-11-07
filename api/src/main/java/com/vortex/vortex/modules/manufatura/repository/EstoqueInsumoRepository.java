package com.vortex.vortex.modules.manufatura.repository;

import com.vortex.vortex.modules.manufatura.entity.EstoqueInsumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EstoqueInsumoRepository extends JpaRepository<EstoqueInsumo, UUID> {

    Optional<EstoqueInsumo> findBySku(String sku);

    List<EstoqueInsumo> findByAtivoTrue();
}

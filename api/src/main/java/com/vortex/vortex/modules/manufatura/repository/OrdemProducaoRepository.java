package com.vortex.vortex.modules.manufatura.repository;

import com.vortex.vortex.modules.manufatura.entity.OrdemProducao;
import com.vortex.vortex.modules.manufatura.enums.StatusOrdemProducao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrdemProducaoRepository extends JpaRepository<OrdemProducao, UUID> {

    Optional<OrdemProducao> findByCodigoOs(String codigoOs);

    Page<OrdemProducao> findAllByOrderByCriadoEmDesc(Pageable pageable);

    long countByStatusNot(StatusOrdemProducao status);
}

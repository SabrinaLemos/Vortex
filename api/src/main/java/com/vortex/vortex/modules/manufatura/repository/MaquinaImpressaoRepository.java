package com.vortex.vortex.modules.manufatura.repository;

import com.vortex.vortex.modules.manufatura.entity.MaquinaImpressao;
import com.vortex.vortex.modules.manufatura.enums.StatusMaquina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MaquinaImpressaoRepository extends JpaRepository<MaquinaImpressao, UUID> {

    Optional<MaquinaImpressao> findByNomeIdentificador(String nomeIdentificador);

    List<MaquinaImpressao> findByAtivoTrue();

    long countByStatus(StatusMaquina status);
}

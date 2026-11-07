package com.vortex.vortex.modules.proposta.repository;

import com.vortex.vortex.modules.proposta.entity.PropostaB2b;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PropostaB2bRepository extends JpaRepository<PropostaB2b, UUID> {

    Optional<PropostaB2b> findByCodigoProposta(String codigoProposta);
}

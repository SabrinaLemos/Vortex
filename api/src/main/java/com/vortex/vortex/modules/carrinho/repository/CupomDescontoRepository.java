package com.vortex.vortex.modules.carrinho.repository;

import com.vortex.vortex.modules.carrinho.entity.CupomDesconto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CupomDescontoRepository extends JpaRepository<CupomDesconto, UUID> {

    Optional<CupomDesconto> findByCodigo(String codigo);
}

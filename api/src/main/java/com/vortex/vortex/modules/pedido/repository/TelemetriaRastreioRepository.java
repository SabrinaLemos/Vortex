package com.vortex.vortex.modules.pedido.repository;

import com.vortex.vortex.modules.pedido.entity.TelemetriaRastreio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TelemetriaRastreioRepository extends JpaRepository<TelemetriaRastreio, UUID> {

    List<TelemetriaRastreio> findByPedidoIdOrderByRegistradoEmDesc(UUID pedidoId);
}

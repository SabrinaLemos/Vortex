package com.vortex.vortex.modules.pedido.repository;

import com.vortex.vortex.modules.pedido.entity.Pedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, UUID> {

    Optional<Pedido> findByCodigoOrdem(String codigoOrdem);

    Page<Pedido> findByUsuarioIdOrderByCriadoEmDesc(UUID usuarioId, Pageable pageable);

    Optional<Pedido> findByIdTransacaoGateway(String idTransacaoGateway);
}

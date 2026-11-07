package com.vortex.vortex.modules.carrinho.repository;

import com.vortex.vortex.modules.carrinho.entity.Carrinho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CarrinhoRepository extends JpaRepository<Carrinho, UUID> {

    Optional<Carrinho> findByUsuarioId(UUID usuarioId);

    Optional<Carrinho> findByTokenSessao(String tokenSessao);
}

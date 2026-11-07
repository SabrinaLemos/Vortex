package com.vortex.vortex.modules.produto.repository;

import com.vortex.vortex.modules.produto.entity.CategoriaProduto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoriaProdutoRepository extends JpaRepository<CategoriaProduto, UUID> {

    Optional<CategoriaProduto> findBySlug(String slug);

    List<CategoriaProduto> findByAtivoTrueOrderByOrdemExibicaoAsc();
}

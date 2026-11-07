package com.vortex.vortex.modules.produto.repository;

import com.vortex.vortex.modules.produto.entity.Produto;
import com.vortex.vortex.modules.produto.enums.TecnologiaFabricacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, UUID> {

    Optional<Produto> findBySlug(String slug);

    Optional<Produto> findBySku(String sku);

    @Query("""
        SELECT p FROM Produto p
        JOIN p.categoria c
        WHERE (:categoriaSlug IS NULL OR c.slug = :categoriaSlug)
          AND (:tecnologia IS NULL OR p.tecnologiaFabricacao = :tecnologia)
          AND (:precoMaximo IS NULL OR p.precoBase <= :precoMaximo)
          AND (:apenasNfc IS NULL OR p.possuiNfc = :apenasNfc)
          AND (:destaque IS NULL OR p.destaque = :destaque)
          AND (:termoBusca IS NULL OR (
                LOWER(p.titulo) LIKE LOWER(CONCAT('%', :termoBusca, '%'))
                OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :termoBusca, '%'))
                OR LOWER(p.descricaoCurta) LIKE LOWER(CONCAT('%', :termoBusca, '%'))
                OR LOWER(c.nome) LIKE LOWER(CONCAT('%', :termoBusca, '%'))
              ))
    """)
    Page<Produto> buscarComFiltros(
        @Param("categoriaSlug") String categoriaSlug,
        @Param("tecnologia") TecnologiaFabricacao tecnologia,
        @Param("precoMaximo") BigDecimal precoMaximo,
        @Param("apenasNfc") Boolean apenasNfc,
        @Param("destaque") Boolean destaque,
        @Param("termoBusca") String termoBusca,
        Pageable pageable
    );
}

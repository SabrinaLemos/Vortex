package com.vortex.vortex.modules.produto.service;

import com.vortex.vortex.modules.produto.dto.CategoriaResponseDTO;
import com.vortex.vortex.modules.produto.dto.ProdutoFiltroRequestDTO;
import com.vortex.vortex.modules.produto.dto.ProdutoResponseDTO;
import com.vortex.vortex.modules.produto.dto.ProdutoResumoDTO;
import com.vortex.vortex.modules.produto.entity.CategoriaProduto;
import com.vortex.vortex.modules.produto.entity.Produto;
import com.vortex.vortex.modules.produto.enums.TecnologiaFabricacao;
import com.vortex.vortex.modules.produto.finder.ProdutoFinder;
import com.vortex.vortex.modules.produto.mapper.CategoriaProdutoMapper;
import com.vortex.vortex.modules.produto.mapper.ProdutoMapper;
import com.vortex.vortex.modules.produto.repository.CategoriaProdutoRepository;
import com.vortex.vortex.modules.produto.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaProdutoRepository categoriaProdutoRepository;
    private final ProdutoFinder produtoFinder;
    private final ProdutoMapper produtoMapper;
    private final CategoriaProdutoMapper categoriaProdutoMapper;

    @Transactional(readOnly = true)
    public Page<ProdutoResumoDTO> listarProdutosPaginado(ProdutoFiltroRequestDTO filtro, Pageable pageable) {
        String categoriaSlug = (filtro.categoria() != null && !filtro.categoria().equalsIgnoreCase("todos"))
            ? filtro.categoria()
            : null;

        TecnologiaFabricacao tecnologia = null;
        if (filtro.tecnologia() != null && !filtro.tecnologia().equalsIgnoreCase("todos")) {
            try {
                tecnologia = TecnologiaFabricacao.valueOf(filtro.tecnologia().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        String termoBusca = (filtro.busca() != null && !filtro.busca().isBlank())
            ? "%" + filtro.busca().trim().toLowerCase() + "%"
            : null;

        Page<Produto> produtos = produtoRepository.buscarComFiltros(
            categoriaSlug,
            tecnologia,
            filtro.precoMaximo(),
            filtro.apenasNfc(),
            filtro.destaque(),
            termoBusca,
            pageable
        );

        return produtos.map(produtoMapper::toResumoDTO);
    }

    @Transactional(readOnly = true)
    public ProdutoResponseDTO buscarPorIdOuSlug(String idOuSlug) {
        Produto produto = produtoFinder.findByIdOuSlug(idOuSlug);
        return produtoMapper.toResponseDTO(produto);
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponseDTO> listarCategoriasAtivas() {
        List<CategoriaProduto> categorias = categoriaProdutoRepository.findByAtivoTrueOrderByOrdemExibicaoAsc();
        return categoriaProdutoMapper.toResponseDTOList(categorias);
    }
}

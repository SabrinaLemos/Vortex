package com.vortex.vortex.modules.manufatura.service;

import com.vortex.vortex.modules.manufatura.dto.AdminDashboardDTO;
import com.vortex.vortex.modules.manufatura.dto.AtualizarStatusOrdemRequestDTO;
import com.vortex.vortex.modules.manufatura.dto.CriarOrdemProducaoRequestDTO;
import com.vortex.vortex.modules.manufatura.dto.EstoqueInsumoResponseDTO;
import com.vortex.vortex.modules.manufatura.dto.MaquinaImpressaoResponseDTO;
import com.vortex.vortex.modules.manufatura.dto.OrdemProducaoResponseDTO;
import com.vortex.vortex.modules.manufatura.entity.EstoqueInsumo;
import com.vortex.vortex.modules.manufatura.entity.MaquinaImpressao;
import com.vortex.vortex.modules.manufatura.entity.OrdemProducao;
import com.vortex.vortex.modules.manufatura.enums.StatusMaquina;
import com.vortex.vortex.modules.manufatura.enums.StatusOrdemProducao;
import com.vortex.vortex.modules.manufatura.finder.MaquinaImpressaoFinder;
import com.vortex.vortex.modules.manufatura.finder.OrdemProducaoFinder;
import com.vortex.vortex.modules.manufatura.mapper.ManufaturaMapper;
import com.vortex.vortex.modules.manufatura.repository.EstoqueInsumoRepository;
import com.vortex.vortex.modules.manufatura.repository.MaquinaImpressaoRepository;
import com.vortex.vortex.modules.manufatura.repository.OrdemProducaoRepository;
import com.vortex.vortex.modules.pedido.entity.Pedido;
import com.vortex.vortex.modules.pedido.repository.PedidoRepository;
import com.vortex.vortex.modules.produto.repository.ProdutoRepository;
import com.vortex.vortex.modules.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ManufaturaService {

    private final OrdemProducaoRepository ordemProducaoRepository;
    private final MaquinaImpressaoRepository maquinaImpressaoRepository;
    private final EstoqueInsumoRepository estoqueInsumoRepository;
    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;
    private final UsuarioRepository usuarioRepository;
    private final OrdemProducaoFinder ordemProducaoFinder;
    private final MaquinaImpressaoFinder maquinaImpressaoFinder;
    private final ManufaturaMapper manufaturaMapper;

    @Transactional(readOnly = true)
    public AdminDashboardDTO obterDashboardMetricas() {
        long ordensAtivas = ordemProducaoRepository.countByStatusNot(StatusOrdemProducao.CONCLUIDA);
        long maquinasOperando = maquinaImpressaoRepository.countByStatus(StatusMaquina.IMPRIMINDO);
        long totalMaquinas = maquinaImpressaoRepository.count();
        long totalProdutos = produtoRepository.count();
        long totalClientes = usuarioRepository.count();

        BigDecimal faturamentoTotal = pedidoRepository.findAll().stream()
            .map(Pedido::getTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new AdminDashboardDTO(
            ordensAtivas,
            maquinasOperando,
            totalMaquinas,
            totalProdutos,
            totalClientes,
            faturamentoTotal
        );
    }

    @Transactional(readOnly = true)
    public Page<OrdemProducaoResponseDTO> listarOrdensProducao(Pageable pageable) {
        Page<OrdemProducao> page = ordemProducaoRepository.findAllByOrderByCriadoEmDesc(pageable);
        return page.map(manufaturaMapper::toOrdemResponseDTO);
    }

    @Transactional
    public OrdemProducaoResponseDTO criarOrdemProducao(CriarOrdemProducaoRequestDTO dto) {
        MaquinaImpressao maquina = null;
        if (dto.maquinaNome() != null && !dto.maquinaNome().isBlank()) {
            try {
                maquina = maquinaImpressaoFinder.findByNome(dto.maquinaNome().trim());
            } catch (Exception ignored) {}
        }

        String codigoOs = "VTX-" + (1000 + new Random().nextInt(9000));
        OrdemProducao entity = manufaturaMapper.toEntity(dto, codigoOs, maquina);
        OrdemProducao salva = ordemProducaoRepository.save(entity);

        log.info("Nova Ordem de Serviço #{} criada para {}", salva.getCodigoOs(), salva.getClienteDescricao());
        return manufaturaMapper.toOrdemResponseDTO(salva);
    }

    @Transactional
    public OrdemProducaoResponseDTO atualizarStatusOrdem(UUID id, AtualizarStatusOrdemRequestDTO dto) {
        OrdemProducao ordem = ordemProducaoFinder.findById(id);
        ordem.setStatus(dto.status());

        if (dto.quantidadeProduzida() != null) {
            ordem.setQuantidadeProduzida(dto.quantidadeProduzida());
        }

        OrdemProducao salva = ordemProducaoRepository.save(ordem);
        log.info("Status da Ordem #{} atualizado para {}", salva.getCodigoOs(), salva.getStatus());
        return manufaturaMapper.toOrdemResponseDTO(salva);
    }

    @Transactional(readOnly = true)
    public List<MaquinaImpressaoResponseDTO> listarMaquinas() {
        List<MaquinaImpressao> maquinas = maquinaImpressaoRepository.findByAtivoTrue();
        return manufaturaMapper.toMaquinaResponseDTOList(maquinas);
    }

    @Transactional(readOnly = true)
    public List<EstoqueInsumoResponseDTO> listarEstoqueInsumos() {
        List<EstoqueInsumo> insumos = estoqueInsumoRepository.findByAtivoTrue();
        return manufaturaMapper.toEstoqueResponseDTOList(insumos);
    }
}

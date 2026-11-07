package com.vortex.vortex.modules.usuario.service;

import com.vortex.vortex.modules.usuario.dto.EnderecoRequestDTO;
import com.vortex.vortex.modules.usuario.dto.EnderecoResponseDTO;
import com.vortex.vortex.modules.usuario.dto.UsuarioAtualizarRequestDTO;
import com.vortex.vortex.modules.usuario.dto.UsuarioResponseDTO;
import com.vortex.vortex.modules.usuario.entity.EnderecoUsuario;
import com.vortex.vortex.modules.usuario.entity.Usuario;
import com.vortex.vortex.modules.usuario.finder.EnderecoUsuarioFinder;
import com.vortex.vortex.modules.usuario.finder.UsuarioFinder;
import com.vortex.vortex.modules.usuario.mapper.EnderecoUsuarioMapper;
import com.vortex.vortex.modules.usuario.mapper.UsuarioMapper;
import com.vortex.vortex.modules.usuario.repository.EnderecoUsuarioRepository;
import com.vortex.vortex.modules.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final EnderecoUsuarioRepository enderecoUsuarioRepository;
    private final UsuarioFinder usuarioFinder;
    private final EnderecoUsuarioFinder enderecoUsuarioFinder;
    private final UsuarioMapper usuarioMapper;
    private final EnderecoUsuarioMapper enderecoUsuarioMapper;

    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarPerfil(UUID usuarioId) {
        Usuario usuario = usuarioFinder.findById(usuarioId);
        return usuarioMapper.toResponseDTO(usuario);
    }

    @Transactional
    public UsuarioResponseDTO atualizarPerfil(UUID usuarioId, UsuarioAtualizarRequestDTO dto) {
        Usuario usuario = usuarioFinder.findById(usuarioId);
        usuario.setNome(dto.nome());
        usuario.setTelefone(dto.telefone());
        usuario.setRazaoSocial(dto.razaoSocial());
        Usuario salvo = usuarioRepository.save(usuario);
        log.info("Perfil do usuário {} atualizado com sucesso", usuarioId);
        return usuarioMapper.toResponseDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<EnderecoResponseDTO> listarEnderecos(UUID usuarioId) {
        List<EnderecoUsuario> enderecos = enderecoUsuarioRepository.findByUsuarioId(usuarioId);
        return enderecoUsuarioMapper.toResponseDTOList(enderecos);
    }

    @Transactional
    public EnderecoResponseDTO adicionarEndereco(UUID usuarioId, EnderecoRequestDTO dto) {
        Usuario usuario = usuarioFinder.findById(usuarioId);
        EnderecoUsuario endereco = enderecoUsuarioMapper.toEntity(dto, usuario);
        EnderecoUsuario salvo = enderecoUsuarioRepository.save(endereco);
        log.info("Novo endereço cadastrado para usuário {}", usuarioId);
        return enderecoUsuarioMapper.toResponseDTO(salvo);
    }

    @Transactional
    public void removerEndereco(UUID usuarioId, UUID enderecoId) {
        EnderecoUsuario endereco = enderecoUsuarioFinder.findByIdAndUsuarioId(enderecoId, usuarioId);
        enderecoUsuarioRepository.delete(endereco);
        log.info("Endereço {} removido do usuário {}", enderecoId, usuarioId);
    }
}

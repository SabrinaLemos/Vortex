package com.vortex.vortex.modules.usuario.repository;

import com.vortex.vortex.modules.usuario.entity.EnderecoUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EnderecoUsuarioRepository extends JpaRepository<EnderecoUsuario, UUID> {

    List<EnderecoUsuario> findByUsuarioId(UUID usuarioId);

    Optional<EnderecoUsuario> findByIdAndUsuarioId(UUID id, UUID usuarioId);
}

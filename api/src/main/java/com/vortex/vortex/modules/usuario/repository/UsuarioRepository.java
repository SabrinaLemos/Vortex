package com.vortex.vortex.modules.usuario.repository;

import com.vortex.vortex.modules.usuario.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByTokenNfcAuth(String tokenNfcAuth);

    Optional<Usuario> findByDocumento(String documento);

    boolean existsByEmail(String email);

    boolean existsByDocumento(String documento);
}

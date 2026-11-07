package com.vortex.vortex.common.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> {})
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Endpoints Públicos de Autenticação
                .requestMatchers("/api/v1/auth/**").permitAll()
                
                // Catálogo de Produtos e Categorias
                .requestMatchers(HttpMethod.GET, "/api/v1/produtos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/categorias/**").permitAll()
                
                // Redirecionamento Público de Tags NFC
                .requestMatchers(HttpMethod.GET, "/api/v1/nfc/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/id/**").permitAll()
                
                // Avaliações públicas de produtos
                .requestMatchers(HttpMethod.GET, "/api/v1/avaliacoes/**").permitAll()
                
                // Webhook de Pagamento Mercado Pago
                .requestMatchers(HttpMethod.POST, "/api/v1/pedidos/webhook/**").permitAll()
                
                // Simulação e Cotação de Frete
                .requestMatchers(HttpMethod.POST, "/api/v1/frete/calcular").permitAll()
                
                // Upload de Projetos CAD
                .requestMatchers(HttpMethod.POST, "/api/v1/personalizados/upload-cad").permitAll()
                
                // Propostas B2B
                .requestMatchers(HttpMethod.POST, "/api/v1/propostas-b2b").permitAll()
                
                // Actuator Health Check
                .requestMatchers("/actuator/**").permitAll()
                
                // Painel Administrativo
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                
                // Qualquer outra rota requer autenticação
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

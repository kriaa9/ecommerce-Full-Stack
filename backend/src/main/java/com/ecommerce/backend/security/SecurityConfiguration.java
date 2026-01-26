package com.ecommerce.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

        private final JwtAuthenticationFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(Customizer.withDefaults()) // Uses your CorsConfig bean
                                .csrf(csrf -> csrf.disable()) // Disables CSRF (Required for stateless JWT)

                                .authorizeHttpRequests(auth -> auth
                                                // 1. PUBLIC ENDPOINTS (Login, Register, Swagger, Actuator)
                                                .requestMatchers(
                                                                "/api/v1/auth/**",
                                                                "/v3/api-docs/**",
                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html",
                                                                "/actuator/**",
                                                                "/api/products/**",
                                                                "/api/categories/**")
                                                .permitAll()

                                                // 2. ADMIN ENDPOINTS (Only users with Role.ADMIN)
                                                // This expects the authority "ROLE_ADMIN" in the JWT
                                                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

                                                // 3. USER ENDPOINTS (Any authenticated user: ADMIN or USER)
                                                .requestMatchers("/api/v1/users/**").authenticated()

                                                // 4. ALL OTHER REQUESTS (Must be logged in)
                                                .anyRequest().authenticated())

                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}
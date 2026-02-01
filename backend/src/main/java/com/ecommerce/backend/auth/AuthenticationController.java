package com.ecommerce.backend.auth;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller class for handling authentication-related requests.
 * Provides endpoints for user registration, authentication, and logout.
 * All request bodies are validated using Jakarta Validation.
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    /**
     * Handles user registration requests.
     * Validates the request body for required fields and proper formats.
     *
     * @param request the registration request containing user details
     * @return a ResponseEntity containing the result of the registration operation
     */
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    /**
     * Handles user authentication requests.
     * Validates the request body for required fields.
     *
     * @param request the authentication request containing credentials
     * @return a ResponseEntity containing the authentication result, including the
     *         token
     */
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @Valid @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    /**
     * Handles user logout requests.
     * For JWT-based authentication, logout is primarily handled client-side by
     * removing the token.
     * This endpoint confirms the logout action.
     *
     * @return a ResponseEntity containing a success message
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logged out successfully");
    }
}

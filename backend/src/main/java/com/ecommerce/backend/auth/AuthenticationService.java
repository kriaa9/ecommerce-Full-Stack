package com.ecommerce.backend.auth;

import com.ecommerce.backend.model.Role;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.security.JwtService;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        /**
         * Registers a new user. If the email already exists, throws a RuntimeException.
         * Otherwise, saves the new user with an encoded password and returns an
         * authentication
         * response with a JWT token and user role.
         *
         * @param request containing user details
         * @return AuthenticationResponse containing the authentication response
         */
        public AuthenticationResponse register(RegisterRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email already exists");
                }

                var user = User.builder()
                                .firstName(request.getFirstName())
                                .lastName(request.getLastName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(Role.USER)
                                .build();

                userRepository.save(user);

                Map<String, Object> extraClaims = new HashMap<>();
                extraClaims.put("role", "ROLE_" + user.getRole().name());

                var jwtToken = jwtService.generateToken(extraClaims, user);
                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .role(user.getRole().name())
                                .firstName(user.getFirstName())
                                .lastName(user.getLastName())
                                .email(user.getEmail())
                                .build();
        }

        /**
         * Authenticates a user with the provided email and password. If authentication
         * is
         * successful, retrieves the user details, generates a JWT token, and returns
         * an authentication response with the user's role and the token.
         *
         * @param request containing email and password
         * @return AuthenticationResponse containing the user's role and JWT token
         */
        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                var user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow();

                Map<String, Object> extraClaims = new HashMap<>();
                extraClaims.put("role", "ROLE_" + user.getRole().name());

                var jwtToken = jwtService.generateToken(extraClaims, user);
                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .role(user.getRole().name())
                                .firstName(user.getFirstName())
                                .lastName(user.getLastName())
                                .email(user.getEmail())
                                .build();
        }
}

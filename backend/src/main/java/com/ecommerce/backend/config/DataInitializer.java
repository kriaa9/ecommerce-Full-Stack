package com.ecommerce.backend.config;

import com.ecommerce.backend.model.Role;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if an admin already exists
        if (userRepository.findByEmail("admin@ecommerce.com").isEmpty()) {
            User admin = User.builder()
                    .firstName("Super")
                    .lastName("Admin")
                    .email("admin@ecommerce.com")
                    .password(passwordEncoder.encode("admin123")) // Change this!
                    .role(Role.ADMIN) // <--- THIS IS KEY
                    .build();

            userRepository.save(admin);
            System.out.println("✅ Default Admin User Created: admin@ecommerce.com / admin123");
        }
    }
}
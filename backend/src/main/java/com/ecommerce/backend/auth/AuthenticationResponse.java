package com.ecommerce.backend.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
     /**
     * Represents the response returned after successful authentication.
     * Contains a JWT token and the user's role, firstname and last name and email.
     */
    private String token;
    private String role;
    private String firstName;
    private String lastName;
    private String email;
}

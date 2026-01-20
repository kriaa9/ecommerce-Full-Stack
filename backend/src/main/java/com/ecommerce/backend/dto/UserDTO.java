package com.ecommerce.backend.dto;

import com.ecommerce.backend.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Data Transfer Object (DTO) for transferring user information.
 *
 * This class represents a user with fields for ID, full name, email, and role.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {


    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
}

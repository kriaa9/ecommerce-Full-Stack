package com.ecommerce.backend.service;


import com.ecommerce.backend.dto.UpdateUserRequest;
import com.ecommerce.backend.dto.UserResponse;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;


    // Get current user profile
    public UserResponse getCurrentUserProfile(Principal connectedUser) {
        User user = getUserFromPrincipal(connectedUser);
        return mapToUserResponse(user);
    }

    // Update current user profile
    @Transactional
    public UserResponse updateMyProfile(UpdateUserRequest request, Principal connectedUser) {
        User user = getUserFromPrincipal(connectedUser);

        // Update fields if provided
        if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null && !request.getLastName().isBlank()) {
            user.setLastName(request.getLastName());
        }
        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getBackupEmail() != null) {
            user.setBackupEmail(request.getBackupEmail());
        }
        if (request.getTelephone() != null) {
            user.setTelephone(request.getTelephone());
        }
        if (request.getMobile() != null) {
            user.setMobile(request.getMobile());
        }
        if (request.getFax() != null) {
            user.setFax(request.getFax());
        }
        if (request.getDepartment() != null) {
            user.setDepartment(request.getDepartment());
        }
        if (request.getPosition() != null) {
            user.setPosition(request.getPosition());
        }
        if (request.getSocialMediaContact() != null) {
            user.setSocialMediaContact(request.getSocialMediaContact());
        }

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    // Delete current user profile
    @Transactional
    public void deleteMyAccount(Principal connectedUser) {
        User user = getUserFromPrincipal(connectedUser);
        userRepository.delete(user);
    }

    // Helper method to get user from principal
    private User getUserFromPrincipal(Principal connectedUser) {
        String email = connectedUser.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}


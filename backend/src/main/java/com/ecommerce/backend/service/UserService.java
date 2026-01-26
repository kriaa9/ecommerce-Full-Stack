package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.UpdateUserRequest;
import com.ecommerce.backend.dto.UserResponse;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public UserResponse getCurrentUserProfile(Principal principal) {
        User user = getUserByPrincipal(principal);
        return mapToUserResponse(user);
    }

    public UserResponse uploadProfilePhoto(MultipartFile photo, Principal principal) throws IOException {
        User user = getUserByPrincipal(principal);
        // Delete old photo if exists
        if (user.getProfilePhotoPublicId() != null) {
            try {
                cloudinaryService.deleteImage(user.getProfilePhotoPublicId());
            } catch (Exception e) {
                // Log but don't fail if deletion fails
                System.err.println("Failed to delete old photo: " + e.getMessage());
            }
        }

        // Upload new photo
        var uploadResult = cloudinaryService.uploadImage(photo, "profile_photos");

        // Update user
        user.setProfilePhotoUrl(uploadResult.get("url"));
        user.setProfilePhotoPublicId(uploadResult.get("publicId"));

        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    public UserResponse updateMyProfile(UpdateUserRequest request, Principal principal) {
        User user = getUserByPrincipal(principal);

        // --- 1. Update Basic Info ---
        if (StringUtils.hasText(request.getFirstName()))
            user.setFirstName(request.getFirstName());
        if (StringUtils.hasText(request.getLastName()))
            user.setLastName(request.getLastName());
        if (request.getGender() != null)
            user.setGender(request.getGender());

        // --- 2. Update Contact Details (MISSING PART) ---
        // You must add these lines, otherwise they will never be saved!
        if (request.getAddress() != null)
            user.setAddress(request.getAddress());
        if (request.getBackupEmail() != null)
            user.setBackupEmail(request.getBackupEmail());
        if (request.getMobile() != null)
            user.setMobile(request.getMobile());
        if (request.getTelephone() != null)
            user.setTelephone(request.getTelephone());
        if (request.getFax() != null)
            user.setFax(request.getFax());
        if (request.getSocialMediaContact() != null)
            user.setSocialMediaContact(request.getSocialMediaContact());

        // --- 3. Update Work Info ---
        if (request.getDepartment() != null)
            user.setDepartment(request.getDepartment());
        if (request.getPosition() != null)
            user.setPosition(request.getPosition());

        // --- 4. Save to Database ---
        User savedUser = userRepository.save(user);

        return mapToUserResponse(savedUser);
    }

    public void deleteMyAccount(Principal principal) {
        User user = getUserByPrincipal(principal);
        userRepository.delete(user);
    }

    // Helper method to get User from Principal
    private User getUserByPrincipal(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    // Helper method to map Entity to DTO
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                // Ensure these are mapped too!
                .gender(user.getGender())
                .address(user.getAddress())
                .backupEmail(user.getBackupEmail())
                .mobile(user.getMobile())
                .telephone(user.getTelephone())
                .fax(user.getFax())
                .department(user.getDepartment())
                .position(user.getPosition())
                .socialMediaContact(user.getSocialMediaContact())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .build();
    }

    public UserResponse deleteProfilePhoto(Principal principal) throws IOException {
        User user = getUserByPrincipal(principal);

        if (user.getProfilePhotoPublicId() != null) {
            cloudinaryService.deleteImage(user.getProfilePhotoPublicId());
            user.setProfilePhotoUrl(null);
            user.setProfilePhotoPublicId(null);
            User savedUser = userRepository.save(user);
            return mapToUserResponse(savedUser);
        }

        return mapToUserResponse(user);
    }
}
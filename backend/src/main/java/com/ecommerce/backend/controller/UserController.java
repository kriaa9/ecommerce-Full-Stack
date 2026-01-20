package com.ecommerce.backend.controller;


import com.ecommerce.backend.dto.UpdateUserRequest;
import com.ecommerce.backend.dto.UserResponse;
import com.ecommerce.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    // Service to handle user-related operations
    private final UserService userService;


    // Get current user profile
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyProfile(Principal principal) {
        return ResponseEntity.ok(userService.getCurrentUserProfile(principal));
    }


    // put /api/v1/users/me to update user profile
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMyProfile(@RequestBody UpdateUserRequest request, Principal principal) {
        return ResponseEntity.ok(userService.updateMyProfile(request, principal));
    }

    // DELETE /api/v1/users/me
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMyAccount(Principal principal) {
        userService.deleteMyAccount(principal);
        return ResponseEntity.noContent().build();
    }



}

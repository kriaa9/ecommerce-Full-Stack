package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.UpdateUserRequest;
import com.ecommerce.backend.dto.UserResponse;
import com.ecommerce.backend.model.Gender;
import com.ecommerce.backend.model.Role;
import com.ecommerce.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.security.Principal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private Principal principal;

    @InjectMocks
    private UserController userController;

    private UserResponse testUserResponse;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        testUserResponse = UserResponse.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .role(Role.USER)
                .gender(Gender.MALE)
                .address("123 Main St")
                .telephone("123-456-7890")
                .build();
    }

    // ==================== getMyProfile Tests ====================

    @Test
    void getMyProfile_ShouldReturnOkStatus_WhenUserExists() {
        // Arrange
        when(userService.getCurrentUserProfile(principal)).thenReturn(testUserResponse);

        // Act
        ResponseEntity<UserResponse> response = userController.getMyProfile(principal);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(userService, times(1)).getCurrentUserProfile(principal);
    }

    @Test
    void getMyProfile_ShouldReturnCorrectUserData_WhenUserExists() {
        // Arrange
        when(userService.getCurrentUserProfile(principal)).thenReturn(testUserResponse);

        // Act
        ResponseEntity<UserResponse> response = userController.getMyProfile(principal);

        // Assert
        UserResponse body = response.getBody();
        assertNotNull(body);
        assertEquals("John", body.getFirstName());
        assertEquals("Doe", body.getLastName());
        assertEquals("john.doe@example.com", body.getEmail());
        assertEquals(Role.USER, body.getRole());
    }

    @Test
    void getMyProfile_ShouldPassPrincipalToService() {
        // Arrange
        when(userService.getCurrentUserProfile(any(Principal.class))).thenReturn(testUserResponse);

        // Act
        userController.getMyProfile(principal);

        // Assert
        verify(userService, times(1)).getCurrentUserProfile(principal);
    }

    // ==================== updateMyProfile Tests ====================

    @Test
    void updateMyProfile_ShouldReturnOkStatus_WhenUpdateSuccessful() {
        // Arrange
        UpdateUserRequest request = UpdateUserRequest.builder()
                .firstName("Jane")
                .lastName("Smith")
                .build();
        
        UserResponse updatedResponse = UserResponse.builder()
                .firstName("Jane")
                .lastName("Smith")
                .email("john.doe@example.com")
                .role(Role.USER)
                .build();
        
        when(userService.updateMyProfile(any(UpdateUserRequest.class), any(Principal.class)))
                .thenReturn(updatedResponse);

        // Act
        ResponseEntity<UserResponse> response = userController.updateMyProfile(request, principal);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void updateMyProfile_ShouldReturnUpdatedUserData_WhenUpdateSuccessful() {
        // Arrange
        UpdateUserRequest request = UpdateUserRequest.builder()
                .firstName("Jane")
                .lastName("Smith")
                .gender(Gender.FEMALE)
                .build();
        
        UserResponse updatedResponse = UserResponse.builder()
                .firstName("Jane")
                .lastName("Smith")
                .email("john.doe@example.com")
                .role(Role.USER)
                .gender(Gender.FEMALE)
                .build();
        
        when(userService.updateMyProfile(request, principal)).thenReturn(updatedResponse);

        // Act
        ResponseEntity<UserResponse> response = userController.updateMyProfile(request, principal);

        // Assert
        UserResponse body = response.getBody();
        assertNotNull(body);
        assertEquals("Jane", body.getFirstName());
        assertEquals("Smith", body.getLastName());
        assertEquals(Gender.FEMALE, body.getGender());
    }

    @Test
    void updateMyProfile_ShouldPassRequestAndPrincipalToService() {
        // Arrange
        UpdateUserRequest request = UpdateUserRequest.builder()
                .firstName("Updated")
                .build();
        
        when(userService.updateMyProfile(any(UpdateUserRequest.class), any(Principal.class)))
                .thenReturn(testUserResponse);

        // Act
        userController.updateMyProfile(request, principal);

        // Assert
        verify(userService, times(1)).updateMyProfile(request, principal);
    }

    @Test
    void updateMyProfile_ShouldHandlePartialUpdate() {
        // Arrange - Only updating address
        UpdateUserRequest request = UpdateUserRequest.builder()
                .address("456 New Street")
                .build();
        
        UserResponse updatedResponse = UserResponse.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .role(Role.USER)
                .address("456 New Street")
                .build();
        
        when(userService.updateMyProfile(request, principal)).thenReturn(updatedResponse);

        // Act
        ResponseEntity<UserResponse> response = userController.updateMyProfile(request, principal);

        // Assert
        UserResponse body = response.getBody();
        assertNotNull(body);
        assertEquals("456 New Street", body.getAddress());
        assertEquals("John", body.getFirstName()); // Other fields unchanged
    }

    // ==================== deleteMyAccount Tests ====================

    @Test
    void deleteMyAccount_ShouldReturnNoContentStatus_WhenDeleteSuccessful() {
        // Arrange
        doNothing().when(userService).deleteMyAccount(principal);

        // Act
        ResponseEntity<Void> response = userController.deleteMyAccount(principal);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void deleteMyAccount_ShouldCallServiceWithPrincipal() {
        // Arrange
        doNothing().when(userService).deleteMyAccount(any(Principal.class));

        // Act
        userController.deleteMyAccount(principal);

        // Assert
        verify(userService, times(1)).deleteMyAccount(principal);
    }

    @Test
    void deleteMyAccount_ShouldOnlyCallDeleteOnce() {
        // Arrange
        doNothing().when(userService).deleteMyAccount(principal);

        // Act
        userController.deleteMyAccount(principal);

        // Assert
        verify(userService, times(1)).deleteMyAccount(principal);
        verifyNoMoreInteractions(userService);
    }

    // ==================== Integration Between Methods ====================

    @Test
    void controller_ShouldDelegateAllOperationsToService() {
        // Arrange
        UpdateUserRequest updateRequest = UpdateUserRequest.builder()
                .firstName("Test")
                .build();
        
        when(userService.getCurrentUserProfile(principal)).thenReturn(testUserResponse);
        when(userService.updateMyProfile(updateRequest, principal)).thenReturn(testUserResponse);
        doNothing().when(userService).deleteMyAccount(principal);

        // Act
        userController.getMyProfile(principal);
        userController.updateMyProfile(updateRequest, principal);
        userController.deleteMyAccount(principal);

        // Assert
        verify(userService, times(1)).getCurrentUserProfile(principal);
        verify(userService, times(1)).updateMyProfile(updateRequest, principal);
        verify(userService, times(1)).deleteMyAccount(principal);
    }
}

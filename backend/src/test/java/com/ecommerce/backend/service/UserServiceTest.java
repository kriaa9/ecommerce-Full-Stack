package com.ecommerce.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.security.Principal;
import java.util.Optional;

import com.ecommerce.backend.dto.UpdateUserRequest;
import com.ecommerce.backend.dto.UserResponse;
import com.ecommerce.backend.model.Gender;
import com.ecommerce.backend.model.Role;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private Principal principal;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testUser = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("encodedPassword")
                .role(Role.USER)
                .gender(Gender.MALE)
                .address("123 Main St")
                .telephone("123-456-7890")
                .build();
    }

    // ==================== getCurrentUserProfile Tests ====================

    @Test
    void getCurrentUserProfile_ShouldReturnUserResponse_WhenUserExists() {
        // Arrange
        when(principal.getName()).thenReturn("john.doe@example.com");
        when(userRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(testUser));

        // Act
        UserResponse response = userService.getCurrentUserProfile(principal);

        // Assert
        assertNotNull(response);
        assertEquals("John", response.getFirstName());
        assertEquals("Doe", response.getLastName());
        assertEquals("john.doe@example.com", response.getEmail());
        assertEquals(Role.USER, response.getRole());
        verify(userRepository, times(1)).findByEmail("john.doe@example.com");
    }

    @Test
    void getCurrentUserProfile_ShouldThrowException_WhenUserNotFound() {
        // Arrange
        when(principal.getName()).thenReturn("nonexistent@example.com");
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () ->
            userService.getCurrentUserProfile(principal)
        );
        verify(userRepository, times(1)).findByEmail("nonexistent@example.com");
    }

    // ==================== updateMyProfile Tests ====================

    @Test
    void updateMyProfile_ShouldUpdateFirstName_WhenProvided() {
        // Arrange
        UpdateUserRequest request = UpdateUserRequest.builder()
                .firstName("Jane")
                .build();

        when(principal.getName()).thenReturn("john.doe@example.com");
        when(userRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        UserResponse response = userService.updateMyProfile(request, principal);

        // Assert
        assertNotNull(response);
        assertEquals("Jane", response.getFirstName());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateMyProfile_ShouldUpdateLastName_WhenProvided() {
        // Arrange
        UpdateUserRequest request = UpdateUserRequest.builder()
                .lastName("Smith")
                .build();

        when(principal.getName()).thenReturn("john.doe@example.com");
        when(userRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        UserResponse response = userService.updateMyProfile(request, principal);

        // Assert
        assertNotNull(response);
        assertEquals("Smith", response.getLastName());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateMyProfile_ShouldUpdateGender_WhenProvided() {
        // Arrange
        UpdateUserRequest request = UpdateUserRequest.builder()
                .gender(Gender.FEMALE)
                .build();

        when(principal.getName()).thenReturn("john.doe@example.com");
        when(userRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        userService.updateMyProfile(request, principal);

        // Assert
        assertEquals(Gender.FEMALE, testUser.getGender());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateMyProfile_ShouldUpdateAddress_WhenProvided() {
        // Arrange
        UpdateUserRequest request = UpdateUserRequest.builder()
                .address("456 Oak Ave")
                .build();

        when(principal.getName()).thenReturn("john.doe@example.com");
        when(userRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        userService.updateMyProfile(request, principal);

        // Assert
        assertEquals("456 Oak Ave", testUser.getAddress());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateMyProfile_ShouldUpdateContactInfo_WhenProvided() {
        // Arrange
        UpdateUserRequest request = UpdateUserRequest.builder()
                .backupEmail("backup@example.com")
                .telephone("555-1234")
                .mobile("555-5678")
                .fax("555-9999")
                .build();

        when(principal.getName()).thenReturn("john.doe@example.com");
        when(userRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        userService.updateMyProfile(request, principal);

        // Assert
        assertEquals("backup@example.com", testUser.getBackupEmail());
        assertEquals("555-1234", testUser.getTelephone());
        assertEquals("555-5678", testUser.getMobile());
        assertEquals("555-9999", testUser.getFax());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateMyProfile_ShouldUpdateWorkInfo_WhenProvided() {
        // Arrange
        UpdateUserRequest request = UpdateUserRequest.builder()
                .department("Engineering")
                .position("Senior Developer")
                .socialMediaContact("@johndoe")
                .build();

        when(principal.getName()).thenReturn("john.doe@example.com");
        when(userRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        userService.updateMyProfile(request, principal);

        // Assert
        assertEquals("Engineering", testUser.getDepartment());
        assertEquals("Senior Developer", testUser.getPosition());
        assertEquals("@johndoe", testUser.getSocialMediaContact());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateMyProfile_ShouldNotUpdateFirstName_WhenBlank() {
        // Arrange
        UpdateUserRequest request = UpdateUserRequest.builder()
                .firstName("   ")  // Blank string should be ignored
                .build();

        when(principal.getName()).thenReturn("john.doe@example.com");
        when(userRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        UserResponse response = userService.updateMyProfile(request, principal);

        // Assert
        assertEquals("John", response.getFirstName());  // Original value preserved
    }

    @Test
    void updateMyProfile_ShouldNotUpdateLastName_WhenBlank() {
        // Arrange
        UpdateUserRequest request = UpdateUserRequest.builder()
                .lastName("")  // Empty string should be ignored
                .build();

        when(principal.getName()).thenReturn("john.doe@example.com");
        when(userRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        UserResponse response = userService.updateMyProfile(request, principal);

        // Assert
        assertEquals("Doe", response.getLastName());  // Original value preserved
    }

    @Test
    void updateMyProfile_ShouldThrowException_WhenUserNotFound() {
        // Arrange
        UpdateUserRequest request = UpdateUserRequest.builder()
                .firstName("Jane")
                .build();

        when(principal.getName()).thenReturn("nonexistent@example.com");
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () ->
            userService.updateMyProfile(request, principal)
        );
        verify(userRepository, never()).save(any(User.class));
    }

    // ==================== deleteMyAccount Tests ====================

    @Test
    void deleteMyAccount_ShouldDeleteUser_WhenUserExists() {
        // Arrange
        when(principal.getName()).thenReturn("john.doe@example.com");
        when(userRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(testUser));
        doNothing().when(userRepository).delete(any(User.class));

        // Act
        userService.deleteMyAccount(principal);

        // Assert
        verify(userRepository, times(1)).delete(testUser);
    }

    @Test
    void deleteMyAccount_ShouldThrowException_WhenUserNotFound() {
        // Arrange
        when(principal.getName()).thenReturn("nonexistent@example.com");
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () ->
            userService.deleteMyAccount(principal)
        );
        verify(userRepository, never()).delete(any(User.class));
    }
}

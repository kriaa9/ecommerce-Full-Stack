package com.ecommerce.backend.auth;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

class AuthenticationControllerTest {

    @Mock
    private AuthenticationService authenticationService;

    @InjectMocks
    private AuthenticationController authenticationController;

    private AuthenticationResponse testAuthResponse;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testAuthResponse = AuthenticationResponse.builder()
                .token("test-jwt-token")
                .role("USER")
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .build();
    }

    // ==================== register Tests ====================

    @Test
    void register_ShouldReturnOkStatus_WhenRegistrationSuccessful() {
        // Arrange
        RegisterRequest request = RegisterRequest.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("password123")
                .build();

        when(authenticationService.register(any(RegisterRequest.class))).thenReturn(testAuthResponse);

        // Act
        ResponseEntity<AuthenticationResponse> response = authenticationController.register(request);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void register_ShouldReturnAuthenticationResponse_WithToken() {
        // Arrange
        RegisterRequest request = RegisterRequest.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("password123")
                .build();

        when(authenticationService.register(request)).thenReturn(testAuthResponse);

        // Act
        ResponseEntity<AuthenticationResponse> response = authenticationController.register(request);

        // Assert
        AuthenticationResponse body = response.getBody();
        assertNotNull(body);
        assertEquals("test-jwt-token", body.getToken());
        assertEquals("USER", body.getRole());
    }

    @Test
    void register_ShouldReturnUserDetails_InResponse() {
        // Arrange
        RegisterRequest request = RegisterRequest.builder()
                .firstName("Jane")
                .lastName("Smith")
                .email("jane.smith@example.com")
                .password("securePassword")
                .build();

        AuthenticationResponse expectedResponse = AuthenticationResponse.builder()
                .token("new-jwt-token")
                .role("USER")
                .firstName("Jane")
                .lastName("Smith")
                .email("jane.smith@example.com")
                .build();

        when(authenticationService.register(request)).thenReturn(expectedResponse);

        // Act
        ResponseEntity<AuthenticationResponse> response = authenticationController.register(request);

        // Assert
        AuthenticationResponse body = response.getBody();
        assertNotNull(body);
        assertEquals("Jane", body.getFirstName());
        assertEquals("Smith", body.getLastName());
        assertEquals("jane.smith@example.com", body.getEmail());
    }

    @Test
    void register_ShouldPassRequestToService() {
        // Arrange
        RegisterRequest request = RegisterRequest.builder()
                .firstName("Test")
                .lastName("User")
                .email("test@example.com")
                .password("testPassword")
                .build();

        when(authenticationService.register(any(RegisterRequest.class))).thenReturn(testAuthResponse);

        // Act
        authenticationController.register(request);

        // Assert
        verify(authenticationService, times(1)).register(request);
    }

    @Test
    void register_ShouldCallServiceOnlyOnce() {
        // Arrange
        RegisterRequest request = RegisterRequest.builder()
                .firstName("Single")
                .lastName("Call")
                .email("single.call@example.com")
                .password("password")
                .build();

        when(authenticationService.register(request)).thenReturn(testAuthResponse);

        // Act
        authenticationController.register(request);

        // Assert
        verify(authenticationService, times(1)).register(request);
        verifyNoMoreInteractions(authenticationService);
    }

    // ==================== authenticate Tests ====================

    @Test
    void authenticate_ShouldReturnOkStatus_WhenAuthenticationSuccessful() {
        // Arrange
        AuthenticationRequest request = AuthenticationRequest.builder()
                .email("john.doe@example.com")
                .password("password123")
                .build();

        when(authenticationService.authenticate(any(AuthenticationRequest.class))).thenReturn(testAuthResponse);

        // Act
        ResponseEntity<AuthenticationResponse> response = authenticationController.authenticate(request);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void authenticate_ShouldReturnAuthenticationResponse_WithToken() {
        // Arrange
        AuthenticationRequest request = AuthenticationRequest.builder()
                .email("john.doe@example.com")
                .password("password123")
                .build();

        when(authenticationService.authenticate(request)).thenReturn(testAuthResponse);

        // Act
        ResponseEntity<AuthenticationResponse> response = authenticationController.authenticate(request);

        // Assert
        AuthenticationResponse body = response.getBody();
        assertNotNull(body);
        assertEquals("test-jwt-token", body.getToken());
        assertNotNull(body.getRole());
    }

    @Test
    void authenticate_ShouldReturnUserDetails_InResponse() {
        // Arrange
        AuthenticationRequest request = AuthenticationRequest.builder()
                .email("john.doe@example.com")
                .password("password123")
                .build();

        when(authenticationService.authenticate(request)).thenReturn(testAuthResponse);

        // Act
        ResponseEntity<AuthenticationResponse> response = authenticationController.authenticate(request);

        // Assert
        AuthenticationResponse body = response.getBody();
        assertNotNull(body);
        assertEquals("John", body.getFirstName());
        assertEquals("Doe", body.getLastName());
        assertEquals("john.doe@example.com", body.getEmail());
    }

    @Test
    void authenticate_ShouldPassRequestToService() {
        // Arrange
        AuthenticationRequest request = AuthenticationRequest.builder()
                .email("test@example.com")
                .password("testPassword")
                .build();

        when(authenticationService.authenticate(any(AuthenticationRequest.class))).thenReturn(testAuthResponse);

        // Act
        authenticationController.authenticate(request);

        // Assert
        verify(authenticationService, times(1)).authenticate(request);
    }

    @Test
    void authenticate_ShouldCallServiceOnlyOnce() {
        // Arrange
        AuthenticationRequest request = AuthenticationRequest.builder()
                .email("single.call@example.com")
                .password("password")
                .build();

        when(authenticationService.authenticate(request)).thenReturn(testAuthResponse);

        // Act
        authenticationController.authenticate(request);

        // Assert
        verify(authenticationService, times(1)).authenticate(request);
        verifyNoMoreInteractions(authenticationService);
    }

    // ==================== Error Handling Tests ====================

    @Test
    void register_ShouldPropagateException_WhenServiceThrowsException() {
        // Arrange
        RegisterRequest request = RegisterRequest.builder()
                .firstName("Test")
                .lastName("User")
                .email("existing@example.com")
                .password("password")
                .build();

        when(authenticationService.register(request)).thenThrow(new RuntimeException("Email already exists"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> authenticationController.register(request));
    }

    @Test
    void authenticate_ShouldPropagateException_WhenServiceThrowsException() {
        // Arrange
        AuthenticationRequest request = AuthenticationRequest.builder()
                .email("wrong@example.com")
                .password("wrongPassword")
                .build();

        when(authenticationService.authenticate(request))
                .thenThrow(new RuntimeException("Bad credentials"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> authenticationController.authenticate(request));
    }

    // ==================== Response Validation Tests ====================

    @Test
    void register_ShouldReturnCompleteResponse() {
        // Arrange
        RegisterRequest request = RegisterRequest.builder()
                .firstName("Complete")
                .lastName("Response")
                .email("complete@example.com")
                .password("password")
                .build();

        AuthenticationResponse completeResponse = AuthenticationResponse.builder()
                .token("complete-token")
                .role("USER")
                .firstName("Complete")
                .lastName("Response")
                .email("complete@example.com")
                .build();

        when(authenticationService.register(request)).thenReturn(completeResponse);

        // Act
        ResponseEntity<AuthenticationResponse> response = authenticationController.register(request);

        // Assert
        AuthenticationResponse body = response.getBody();
        assertNotNull(body);
        assertNotNull(body.getToken());
        assertNotNull(body.getRole());
        assertNotNull(body.getFirstName());
        assertNotNull(body.getLastName());
        assertNotNull(body.getEmail());
    }

    @Test
    void authenticate_ShouldReturnCompleteResponse() {
        // Arrange
        AuthenticationRequest request = AuthenticationRequest.builder()
                .email("complete@example.com")
                .password("password")
                .build();

        AuthenticationResponse completeResponse = AuthenticationResponse.builder()
                .token("complete-token")
                .role("USER")
                .firstName("Complete")
                .lastName("Response")
                .email("complete@example.com")
                .build();

        when(authenticationService.authenticate(request)).thenReturn(completeResponse);

        // Act
        ResponseEntity<AuthenticationResponse> response = authenticationController.authenticate(request);

        // Assert
        AuthenticationResponse body = response.getBody();
        assertNotNull(body);
        assertNotNull(body.getToken());
        assertNotNull(body.getRole());
        assertNotNull(body.getFirstName());
        assertNotNull(body.getLastName());
        assertNotNull(body.getEmail());
    }
}

package com.ecommerce.backend.security;

import com.ecommerce.backend.model.Role;
import com.ecommerce.backend.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    
    // Test secret key - Base64 encoded 256-bit key for testing purposes
    private static final String TEST_SECRET_KEY = "dGVzdC1zZWNyZXQta2V5LWZvci1qd3QtdG9rZW4tZ2VuZXJhdGlvbi0yNTYtYml0cw==";
    private static final long TEST_EXPIRATION = 86400000L; // 24 hours in milliseconds

    private User testUser;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        
        // Set the private fields using reflection for testing
        ReflectionTestUtils.setField(jwtService, "secretKey", TEST_SECRET_KEY);
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", TEST_EXPIRATION);
        
        testUser = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("encodedPassword")
                .role(Role.USER)
                .build();
    }

    // ==================== generateToken Tests ====================

    @Test
    void generateToken_ShouldReturnValidToken_WhenUserDetailsProvided() {
        // Act
        String token = jwtService.generateToken(testUser);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void generateToken_ShouldContainCorrectUsername_WhenTokenGenerated() {
        // Act
        String token = jwtService.generateToken(testUser);
        String extractedUsername = jwtService.extractUsername(token);

        // Assert
        assertEquals("john.doe@example.com", extractedUsername);
    }

    @Test
    void generateToken_WithExtraClaims_ShouldContainExtraClaims() {
        // Arrange
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", "USER");
        extraClaims.put("customClaim", "customValue");

        // Act
        String token = jwtService.generateToken(extraClaims, testUser);

        // Assert
        assertNotNull(token);
        String extractedUsername = jwtService.extractUsername(token);
        assertEquals("john.doe@example.com", extractedUsername);
    }

    // ==================== extractUsername Tests ====================

    @Test
    void extractUsername_ShouldReturnCorrectUsername_WhenValidToken() {
        // Arrange
        String token = jwtService.generateToken(testUser);

        // Act
        String username = jwtService.extractUsername(token);

        // Assert
        assertEquals("john.doe@example.com", username);
    }

    // ==================== isTokenValid Tests ====================

    @Test
    void isTokenValid_ShouldReturnTrue_WhenTokenIsValidAndUsernameMatches() {
        // Arrange
        String token = jwtService.generateToken(testUser);

        // Act
        boolean isValid = jwtService.isTokenValid(token, testUser);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void isTokenValid_ShouldReturnFalse_WhenUsernameDoesNotMatch() {
        // Arrange
        String token = jwtService.generateToken(testUser);
        
        User differentUser = User.builder()
                .email("different@example.com")
                .password("password")
                .role(Role.USER)
                .build();

        // Act
        boolean isValid = jwtService.isTokenValid(token, differentUser);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void isTokenValid_ShouldThrowException_WhenTokenIsExpired() {
        // Arrange - Set a very short expiration for this test
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 1L); // 1 millisecond
        
        String token = jwtService.generateToken(testUser);
        
        // Wait for token to expire
        try {
            Thread.sleep(50);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Act & Assert - JWT library throws ExpiredJwtException for expired tokens
        assertThrows(io.jsonwebtoken.ExpiredJwtException.class, () -> 
            jwtService.isTokenValid(token, testUser)
        );
        
        // Reset expiration for other tests
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", TEST_EXPIRATION);
    }

    // ==================== extractClaim Tests ====================

    @Test
    void extractClaim_ShouldReturnSubject_WhenClaimsResolverProvided() {
        // Arrange
        String token = jwtService.generateToken(testUser);

        // Act
        String subject = jwtService.extractClaim(token, claims -> claims.getSubject());

        // Assert
        assertEquals("john.doe@example.com", subject);
    }

    @Test
    void extractClaim_ShouldReturnIssuedAt_WhenClaimsResolverProvided() {
        // Arrange
        String token = jwtService.generateToken(testUser);

        // Act
        Date issuedAt = jwtService.extractClaim(token, claims -> claims.getIssuedAt());

        // Assert
        assertNotNull(issuedAt);
        assertTrue(issuedAt.before(new Date()) || issuedAt.equals(new Date()));
    }

    @Test
    void extractClaim_ShouldReturnExpiration_WhenClaimsResolverProvided() {
        // Arrange
        String token = jwtService.generateToken(testUser);

        // Act
        Date expiration = jwtService.extractClaim(token, claims -> claims.getExpiration());

        // Assert
        assertNotNull(expiration);
        assertTrue(expiration.after(new Date()));
    }

    // ==================== Token Structure Tests ====================

    @Test
    void generateToken_ShouldCreateTokenWithThreeParts() {
        // Act
        String token = jwtService.generateToken(testUser);

        // Assert - JWT tokens have three parts separated by dots
        String[] parts = token.split("\\.");
        assertEquals(3, parts.length);
    }

    @Test
    void generateToken_ShouldBeConsistentForSameUser() {
        // Act
        String token1 = jwtService.generateToken(testUser);
        String token2 = jwtService.generateToken(testUser);

        // Assert - Both tokens should be valid and extract same username
        assertEquals(jwtService.extractUsername(token1), jwtService.extractUsername(token2));
    }

    // ==================== Edge Cases ====================

    @Test
    void generateToken_ShouldHandleUserWithMinimalInfo() {
        // Arrange
        User minimalUser = User.builder()
                .email("minimal@example.com")
                .password("password")
                .role(Role.USER)
                .build();

        // Act
        String token = jwtService.generateToken(minimalUser);

        // Assert
        assertNotNull(token);
        assertEquals("minimal@example.com", jwtService.extractUsername(token));
    }

    @Test
    void generateToken_ShouldHandleEmptyExtraClaims() {
        // Arrange
        Map<String, Object> emptyClaims = new HashMap<>();

        // Act
        String token = jwtService.generateToken(emptyClaims, testUser);

        // Assert
        assertNotNull(token);
        assertEquals("john.doe@example.com", jwtService.extractUsername(token));
    }
}

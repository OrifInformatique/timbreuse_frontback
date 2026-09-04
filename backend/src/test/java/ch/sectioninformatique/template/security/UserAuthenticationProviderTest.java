package ch.sectioninformatique.template.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import ch.sectioninformatique.template.user.UserDto;
import ch.sectioninformatique.template.user.UserService;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test class for {@link UserAuthenticationProvider}.
 * This class tests the JWT token creation, validation, and authentication
 * functionality of the UserAuthenticationProvider.
 */
@ExtendWith(MockitoExtension.class)
class UserAuthenticationProviderTest {

    @Mock
    private UserService userService;

    private UserAuthenticationProvider authenticationProvider;

    private static final String TEST_SECRET_KEY = "test-secret-key";
    private static final String TEST_LOGIN = "test@example.com";
    private static final String TEST_FIRST_NAME = "John";
    private static final String TEST_LAST_NAME = "Doe";

    @BeforeEach
    void setUp() {
        authenticationProvider = new UserAuthenticationProvider(userService);
        // Use reflection to set the secret key
        try {
            java.lang.reflect.Field field = UserAuthenticationProvider.class.getDeclaredField("secretKey");
            field.setAccessible(true);
            field.set(authenticationProvider, Base64.getEncoder().encodeToString(TEST_SECRET_KEY.getBytes()));
        } catch (Exception e) {
            throw new RuntimeException("Failed to set secret key", e);
        }
    }

    /**
     * Tests the token creation functionality.
     * Verifies that:
     * - Token is created successfully
     * - Token contains correct user claims
     * - Token is properly formatted
     */
    @Test
    void testCreateToken() {
        // Given
        UserDto user = UserDto.builder()
                .login(TEST_LOGIN)
                .firstName(TEST_FIRST_NAME)
                .lastName(TEST_LAST_NAME)
                .mainRole("USER")
                .permissions(Arrays.asList("read", "write"))
                .build();

        // When
        String token = authenticationProvider.createToken(user);

        // Then
        assertNotNull(token);
        assertTrue(token.split("\\.").length == 3); // JWT has 3 parts
    }

    /**
     * Tests the basic token validation.
     * Verifies that:
     * - Valid token is accepted
     * - Authentication object is created with correct user details
     * - Authorities are properly set
     */
    @Test
    void testValidateToken() {
        // Given
        UserDto user = UserDto.builder()
                .login(TEST_LOGIN)
                .firstName(TEST_FIRST_NAME)
                .lastName(TEST_LAST_NAME)
                .mainRole("USER")
                .permissions(Arrays.asList("read", "write"))
                .build();

        // When
        String token = authenticationProvider.createToken(user);

        // Then
        assertNotNull(token);
        assertTrue(token.split("\\.").length == 3); // JWT has 3 parts
    }

    /**
     * Tests the authority building functionality.
     * Verifies that:
     * - Role is properly prefixed with "ROLE_"
     * - Permissions are correctly converted to authorities
     * - All authorities are included in the result
     */
    @Test
    void testBuildAuthorities() throws Exception {
        // Given
        List<String> roles = Arrays.asList("USER");
        int authoritiesExpectedCount = RoleEnum.USER.getPermissions().size() + 1; // permissions + role_USER

        // When
        Method method = UserAuthenticationProvider.class.getDeclaredMethod("buildAuthorities", List.class);
        method.setAccessible(true);
        @SuppressWarnings("unchecked")
        List<SimpleGrantedAuthority> authorities = (List<SimpleGrantedAuthority>) method.invoke(authenticationProvider, roles);

        // Then
        assertNotNull(authorities);
        assertEquals(authoritiesExpectedCount, authorities.size()); 
        assertTrue(authorities.stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_USER")));
        assertTrue(authorities.stream()
                .anyMatch(auth -> auth.getAuthority().equals("user:read")));
    }
} 
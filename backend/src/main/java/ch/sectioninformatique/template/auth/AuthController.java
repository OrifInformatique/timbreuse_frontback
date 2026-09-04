package ch.sectioninformatique.template.auth;

import java.net.URI;
import java.time.Duration;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ch.sectioninformatique.template.user.UserDto;
import ch.sectioninformatique.template.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

/**
 * Controller handling user authentication and registration.
 * This controller provides endpoints for user login and registration,
 * managing the authentication process and user creation.
 */
@RequestMapping("/auth")
@RequiredArgsConstructor
@RestController
@SuppressWarnings("null")
public class AuthController {

    /** Service for handling user-related operations */
    private final UserService userService;

    /** Client to send authentication requests to the spring-auth application */
    private final AuthClient authClient;

    // Logger for debugging and monitoring the authentication flow.
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    // Name of the Session attribute used to store the frontend redirect URL during login initiation.
    private static final String FRONTEND_REDIRECT_SESSION_KEY = "FRONTEND_REDIRECT_URL";

    @Value("${SECURITY_JWT_TOKEN_ACCESS_TOKEN_LIFETIME}")
    private Duration refreshTokenLifeTime; 


    /**
     * Handles POST requests to "/login"
     * Accepts login credentials (login and password) as a request body, validated
     * for correctness
     * Calls the authentication client to perform login with provided credentials
     * Returns a reactive Mono<ResponseEntity<UserDto>>containing the login response
     * (e.g., token or
     * status message)
     * 
     * @param credentialsDto
     * @return Mono<ResponseEntity<UserDto>> with login response
     */
    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody @Valid CredentialsDto credentialsDto) {
        return authClient.login(credentialsDto)
                .onErrorResume(ex -> Mono.error(ex))
                .block();
    }

    /**
     * Handles POST requests to "/register"
     * Accepts user registration data as a request body, validated for correctness
     * Calls the authentication client to perform registration with provided user
     * data
     * On successful registration, also registers the user locally in the system
     * Returns a reactive Mono<ResponseEntity<UserDto>> containing the registration
     * response or error message
     * 
     * @param user
     * @return Mono<ResponseEntity<UserDto>> with registration response
     */
    @PostMapping("/register")
    @PreAuthorize("hasAuthority('user:write')")
    public ResponseEntity<UserDto> register(@RequestHeader("Authorization") String token,
                                            @RequestBody @Valid RegisterDto user) {
                                                
        return authClient.register(token, user)
                .flatMap(response -> {
                    // On successful registration, also register user locally
                    userService.register(user);

                    // Return HTTP 200 OK with the response body
                    return Mono.just(response);
                })
                .block();
    }

    /**
     * Handles POST requests to "/refresh"
     * Accepts refresh token from cookie
     * 
     * On successful refresh send the new access token
     * 
     * @param refreshToken The refresh token from the cookie
     * @return ResponseEntity<TokenResponseDto> with new token
     */
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponseDto> refreshLogin(@CookieValue("refresh_token") String refreshToken) {
        return authClient.refreshLogin(refreshToken)
            .map(response -> ResponseEntity.status(response.getStatusCode())
                              .headers(response.getHeaders())
                              .body(response.getBody()))
            .block();
    }

    /**
     * Handles PUT requests to "/update-password"
     * Accepts new password data as a request body, validated for correctness
     * Calls the authentication client to set the new password for the user
     * Returns a ResponseEntity<MessageResponseDto> containing the response message
     * 
     * @param token             The authorization token from the request header
     * @param updatePasswordDto The PasswordUpdateDto containing the old and new
     *                          passwords
     * @return ResponseEntity<MessageResponseDto> with set password response
     */
    @PutMapping("/update-password")
    public ResponseEntity<MessageResponseDto> updatePassword(@RequestHeader("Authorization") String token,
            @RequestBody @Valid PasswordUpdateDto updatePasswordDto) {
        return authClient.updatePassword(token, updatePasswordDto)
                .map(responseEntity -> responseEntity.getBody())
                .map(messageResponse -> ResponseEntity.ok(messageResponse))
                .block();
    }

    /**
     * Handles GET requests to "/auth/login/azure"
     * 
     * This endpoint is used to initiate the OAuth2 login process by redirecting
     * to the spring-auth Azure login endpoint.
     * The login process is handled by the spring-auth application, which will manage the
     * authentication flow with Azure and redirect to redirectUrl after successful login.
     * 
     * @param redirectUrl  The URL to redirect to after successful authentication (optional).
     *                     If not provided, uses the Referer header. If neither is available,
     *                     no redirect URL is used.
     * @param request      The HTTP request object
     *
     * @return ResponseEntity<Void> with redirect to the spring-auth Azure login endpoint
     *         or an error response if the redirection fails.
     */
    @GetMapping("/login/azure")
    public ResponseEntity<Void> OAuth2AzureLogin(@RequestParam(required = false) String redirectUrl,
                                                 HttpServletRequest request) {

        HttpSession session = request.getSession(true);

        // Store redirect URL in session if provided, otherwise store the referer header
        if (redirectUrl != null && !redirectUrl.isEmpty()) {
            session.setAttribute(FRONTEND_REDIRECT_SESSION_KEY, redirectUrl);
            log.debug("Stored redirect URL from parameter: {}", redirectUrl);
        } else {
            String referer = request.getHeader("Referer");
            if (referer != null && !referer.isEmpty()) {
                session.setAttribute(FRONTEND_REDIRECT_SESSION_KEY, referer);
                log.debug("Stored redirect URL from Referer header: {}", referer);
            } else {
                log.debug("No redirect URL provided");
            }
        }

        ResponseCookie cookie = ResponseCookie.from("redirect_url", redirectUrl)
        .httpOnly(true)
        .path("/")
        .sameSite("None")
        .secure(true)
        .build();

        // Build the login URI for the spring-auth Azure login endpoint
        URI loginUri = authClient.buildAzureLoginUri();

        // Redirect to the spring-auth Azure login endpoint
        log.debug("Redirecting to spring-auth Azure login endpoint: {}", loginUri);
        return ResponseEntity.status(HttpStatus.FOUND).header(HttpHeaders.SET_COOKIE, cookie.toString()).location(loginUri).build();
    }

    /**
     * Handles GET requests to "/auth/auth-code"
     * 
     * This endpoint is called after a successful OAuth2 login handeled by spring-auth application.
     * It is used to exchange the authorization code for access and refresh tokens.
     * 
     * Then it gets or create the corresponding user in local database, stores user informations
     * in session and redirects to the frontend application.
     * 
     * The frontend should then call /auth/tokens endpoint to get the informations wich where
     * stored in session.
     * 
     * @param authCode the authorization code received from the spring-auth application
     * @param userId the ID of the user for whom to exchange the authorization code
     * @param request the HTTP request object
     * @param redirectUrl the URL to redirect to after successful authentication
     * @return ResponseEntity redirecting to the frontend 
     */
    @GetMapping("/auth-code")
    public ResponseEntity<?> authCode(@RequestParam String authCode, @RequestParam Long userId, HttpServletRequest request, @CookieValue(name="redirect_url") String redirectUrl) {
        
        log.debug("OAuth2 login successful, using authcode to get tokens");

        HttpSession session = request.getSession();

        AuthCodeDto authCodeDto = AuthCodeDto.builder()
            .code(authCode)
            .id(userId)
            .build();

        // Exchange the AuthCode provided by spring-auth application and get
        // a ResponseEntity containing user informations, including tokens
        ResponseEntity<UserDto> response = authClient.getTokenWithAuthCode(authCodeDto).block();
    
        UserDto user = response.getBody();
        List<String> cookies = response.getHeaders().get(HttpHeaders.SET_COOKIE);

        if (cookies != null) {
            for (String cookie : cookies) {
                if (cookie.startsWith("refresh_token=")) {
                    session.setAttribute("refresh_token", cookie);
                }
            }
        }

        log.debug("Got tokens, get or create the logged user in local database");

        UserDto loggedUser = userService.getOrCreateUser(user);
       
        loggedUser.setToken(user.getToken());
        session.setAttribute("loggedUser", loggedUser);

        log.debug("Redirecting to: {}", redirectUrl);
        return ResponseEntity
            .status(HttpStatus.FOUND)
            .location(URI.create(redirectUrl))
            .build(); 
    }

    /**
     * Retrieves the informations for the logged-in user, including authentication and refresh tokens
     * 
     * @param request the HTTP request object
     * @return ResponseEntity with the user informations, including authentication and refresh tokens
     */
    @GetMapping("/tokens")
    public ResponseEntity<?> getToken(HttpServletRequest request){
        HttpSession session = request.getSession();

        if(session != null){
            try{
                UserDto userDto = (UserDto) session.getAttribute("loggedUser");
                String cookies = (String) session.getAttribute("refresh_token");
                log.debug("refresh_token : {}", cookies);
                log.debug("UserDto : {}", userDto);

                String refreshToken = cookies
                    .substring("refresh_token=".length())
                    .split(";")[0];

                ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
                    .httpOnly(true)
                    .secure(true)
                    .path("/auth/refresh")
                    .maxAge(refreshTokenLifeTime)
                    .sameSite("None")
                    .build();

                return ResponseEntity
                    .status(200)
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(userDto);
                    
            }
            catch (NullPointerException e){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }
        
        // No session provided, access is not authorized
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


    /**
     * Handles POST requests to "/logout"
     * Sends the logout request to the authentication provider
     * Passes the authorization token from the request header7
     * Returns the response from the authentication provider
     * 
     * @param token The authorization token from the request header
     * @return ResponseEntity with logout response from authentication provider
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token, HttpServletRequest request) {

        var session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        SecurityContextHolder.clearContext();

        return authClient.logout(token)
                .map(response -> ResponseEntity.status(response.getStatusCode())
                        .headers(response.getHeaders())
                        .body(response.getBody()))
                .onErrorResume(ex -> Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).build()))
                .block();
    }
}

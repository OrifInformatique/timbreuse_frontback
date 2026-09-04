package ch.sectioninformatique.template.user;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;

import ch.sectioninformatique.template.app.exceptions.AppException;
import ch.sectioninformatique.template.auth.AuthClient;
import ch.sectioninformatique.template.auth.RegisterDto;
import ch.sectioninformatique.template.security.Role;
import ch.sectioninformatique.template.security.RoleEnum;
import ch.sectioninformatique.template.security.RoleRepository;
import ch.sectioninformatique.template.user.UserExceptions.DefaultRoleNotFoundException;
import ch.sectioninformatique.template.user.UserExceptions.DuplicateUserException;
import ch.sectioninformatique.template.user.UserExceptions.RoleNotFoundException;
import ch.sectioninformatique.template.user.UserExceptions.UserAlreadyHasRoleException;
import ch.sectioninformatique.template.user.UserExceptions.UserNotFoundByLoginException;
import ch.sectioninformatique.template.user.UserExceptions.UserNotFoundException;
import ch.sectioninformatique.template.user.UserExceptions.UserCreationException;
import ch.sectioninformatique.template.user.UserExceptions.UserPromotionException;
import ch.sectioninformatique.template.user.UserExceptions.UserUpdateException;
import ch.sectioninformatique.template.user.UserExceptions.UserDeletionException;
import ch.sectioninformatique.template.user.UserExceptions.UserValidationException;
import ch.sectioninformatique.template.user.UserExceptions.PermanentUserDeletionException;
import ch.sectioninformatique.template.user.UserExceptions.UserRetrievalException;
import ch.sectioninformatique.template.user.UserExceptions.InactiveUserException;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.hibernate.Session;

/**
 * Service class for managing user-related operations.
 * This class provides functionality for:
 * - User authentication and registration
 * - User role management (promotion, revocation)
 * - User deletion
 * - Azure user integration
 * - User search and retrieval
 */
@RequiredArgsConstructor
@Service
@Slf4j

public class UserService {

    /** EntityManager for database operations */
    private final EntityManager entityManager;

    /** Repository for user data access */
    private final UserRepository userRepository;

    /** Repository for role data access */
    private final RoleRepository roleRepository;

    /** Client for authentication operations */
    @Autowired
    private @Lazy AuthClient authClient;

    /** Mapper for converting between User entities and DTOs */
    private final UserMapper userMapper;

    /**
     * Promotes a user to a local app role.
     * This operation:
     * - Verifies the user exists
     * - Checks if the user already has the local app role
     * - Removes existing roles and assigns the local app role
     *
     * @param userId The ID of the user to promote
     * @return UserDto containing the updated user's information
     * @throws UserNotFoundException if the user is not found
     * @throws UserAlreadyHasRoleException if the user already has the role
     * @throws RoleNotFoundException if the role is not found
     * @throws UserPromotionException if the promotion operation fails
     */
    public UserDto promoteToLocalAppRole(@NonNull String userLogin) {
        try {
            User user = userRepository.findByLogin(userLogin)
                    .orElseThrow(UserNotFoundException::new);

            for (Role role : user.getAppSpecificRoles()) {
                if (role.getName().equals(RoleEnum.LOCAL_APP_ROLE)) {
                    throw new UserAlreadyHasRoleException(RoleEnum.LOCAL_APP_ROLE.name());
                }
            }

            Role testAdminRole = roleRepository.findByName(RoleEnum.LOCAL_APP_ROLE)
                    .orElseThrow(() -> new RoleNotFoundException(RoleEnum.LOCAL_APP_ROLE.name()));

            user.getAppSpecificRoles().add(testAdminRole);
            userRepository.save(user);
            return userMapper.toUserDto(user);
        } catch (UserNotFoundException | UserAlreadyHasRoleException | RoleNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new UserPromotionException(e.getMessage());
        }
    }

    /**
     * Retrieves all users in the system (not including soft-deleted users).
     *
     * @return List of all User entities
     */
    public List<UserDto> allUsers() {
        Session session = entityManager.unwrap(Session.class);
        session.enableFilter("deletedFilter").setParameter("isDeleted", false);
        List<User> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        List<UserDto> usersDto = new ArrayList<>();
        for (User user : users) {
            usersDto.add(userMapper.toUserDto(user));
        }
        return usersDto;
    }

    /**
     * Retrieves all users including soft-deleted ones.
     *
     * @return List of all User entities including deleted
     */
    public List<UserDto> allWithDeletedUsers() {
        List<User> users = new ArrayList<>();
        userRepository.findAllIncludingDeleted().forEach(users::add);
        List<UserDto> usersDto = new ArrayList<>();
        for (User user : users) {
            usersDto.add(userMapper.toUserDto(user));
        }
        return usersDto;
    }

    /**
     * Retrieves only soft-deleted users.
     *
     * @return List of soft-deleted User entities
     */
    public List<UserDto> deletedUsers() {
        Session session = entityManager.unwrap(Session.class);
        session.enableFilter("deletedFilter").setParameter("isDeleted", true);
        List<User> users = new ArrayList<>();
        userRepository.findAllDeleted().forEach(users::add);
        List<UserDto> usersDto = new ArrayList<>();
        for (User user : users) {
            usersDto.add(userMapper.toUserDto(user));
        }
        return usersDto;
    }

    /**
     * Retrieves the authenticated user's information.
     *
     * @return UserDto containing the current user's information
     */
    public UserDto me(UserDto currentUser) {
        User user = userRepository.findByLogin(currentUser.getLogin())
                .orElseThrow(() -> new UserNotFoundByLoginException(currentUser.getLogin()));
        UserDto userMapped = userMapper.toUserDto(user);
        return userMapped;
    }

    /**
     * Registers a new user in the system.
     * This method:
     * - Checks if the login is already taken
     * - Assigns the default USER role
     * - Saves the user to the database
     *
     * @param registerDto The user registration data
     * @return User containing the created user's information
     * @throws DuplicateUserException if the login already exists
     * @throws DefaultRoleNotFoundException if the default role is not found
     * @throws UserCreationException if user creation fails
     */
    public User register(RegisterDto registerDto) {
        try {
            // Basic validation before persisting
            if (registerDto.login() == null || registerDto.login().isBlank()
                    || registerDto.firstName() == null || registerDto.firstName().isBlank()
                    || registerDto.lastName() == null || registerDto.lastName().isBlank()) {
                throw new UserValidationException("user.validation.missingFields", true);
            }

            Optional<User> optionalUser = userRepository.findByLogin(registerDto.login());

            if (optionalUser.isPresent()) {
                throw new DuplicateUserException(registerDto.login());
            }

            User user = userMapper.signUpToUser(registerDto);

            // Add default USER role
            Role userRole = roleRepository.findByName(RoleEnum.USER)
                .orElseThrow(DefaultRoleNotFoundException::new);
            user.setMainRole(userRole);

            User savedUser = userRepository.save(user);
            return savedUser;
        } catch (UserValidationException | DuplicateUserException | DefaultRoleNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new UserCreationException(e.getMessage());
        }
    }

    /**
     * Get or create an authenticated user.
     * This method:
     * - Get the list of user in the database
     * - test the existence of the cureent user
     * - Register the current user if not in the database
     *
     * @param userDto The user registration data
     * @return Found or created user
     * @throws UserCreationException if user creation fails
     */
    public User getOrCreateAuthenticatedUser(UserDto userDto) {
        try {
            List<User> users = userRepository.findAll();

            User localUser = null;

            for (User user : users) {
                if (user.getUsername().contains(userDto.getLogin())) {
                    localUser = user;
                }
            }

            if (localUser == null) {
                RegisterDto newUser = new RegisterDto(userDto.getFirstName(), userDto.getLastName(),
                        userDto.getLogin(), null);

                localUser = this.register(newUser);
            }

            return localUser;
        } catch (DuplicateUserException | DefaultRoleNotFoundException | UserCreationException e) {
            throw e;
        } catch (Exception e) {
            throw new UserCreationException(e.getMessage());
        }
    }

    /**
     * Update The main role of an autheticated user if different.
     * This method:
     * - Test if the current user's main role is the same as the one in the database
     * - Get the apropriate role in the database
     * - Change the local user Role for the corrext one
     *
     * @param localUser   The local user's data
     * @param currentUser The the transmitted user's data
     * @throws RoleNotFoundException if the new role is not found
     * @throws UserUpdateException if the role update fails
     */
    public void updateMainRole(User localUser, UserDto currentUser) {
        try {
            String localMainRole = localUser.getMainRole().getName().name();

            if (!localMainRole.contains(currentUser.getMainRole())) {
                Role newMainRole = roleRepository.findByName(RoleEnum.valueOf(currentUser.getMainRole()))
                        .orElseThrow(() -> new RoleNotFoundException(currentUser.getMainRole()));

                localUser.setMainRole(newMainRole);
                userRepository.save(localUser);
            }
        } catch (RoleNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new UserUpdateException(e.getMessage());
        }
    }

    /**
     * get the list of roles attribuated to the user
     * This method:
     * - Test if the current user's has app specifique roles registered
     * - add the app specifique roles to a list
     * - add the main role of the user to the list
     *
     * @param localUser The local user's data
     * @return list of roles
     */
    public List<String> getRolesList(User localUser) {

        List<String> allRoles = new ArrayList<>();

        if (localUser.getAppSpecificRoles() != null) {
            for (String role : localUser.getAppSpecificRolesString()) {
                allRoles.add(role);
            }
        }

        allRoles.add(localUser.getMainRole().getName().name());

        return allRoles;
    }

    /**
     * Deletes a user from the system.
     * This method:
     * - Verifies the user exists
     * - Deletes the user from the database
     *
     * @param userId The ID of the user to delete
     * @return UserDto containing the deleted user's information
     * @throws UserNotFoundException if the user is not found
     * @throws UserDeletionException if the deletion fails
     */
    public UserDto deleteUser(@NonNull String userLogin) {
        try {
            // Get the user to delete
            User userToDelete = userRepository.findByLogin(userLogin)
                .orElseThrow(UserNotFoundException::new);

            // Delete the user
            userRepository.deleteById(userToDelete.getId());
            return userMapper.toUserDto(userToDelete);
        } catch (UserNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new UserDeletionException(e.getMessage());
        }
    }

    /**
     * Permanently deletes a user from the system.
     * This method:
     * - Verifies the user exists
     * - Deletes the user from the database
     *
     * @param userId The ID of the user to delete
     * @return UserDto containing the deleted user's information
     * @throws UserNotFoundException if the user is not found
     * @throws UserDeletionException if the permanent deletion fails
     */
    public UserDto deleteUserPermanent(@NonNull String userLogin) {
        try {
            // Get the user to delete
            User userToDelete = userRepository.findByLogin(userLogin)
                .orElseThrow(UserNotFoundException::new);

            // Delete the user
            userRepository.deletePermanentlyById(userToDelete.getId());
            return userMapper.toUserDto(userToDelete);
        } catch (UserNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new PermanentUserDeletionException(e.getMessage());
        }
    }

    /**
     * Deletes a user from the system by login.
     * This method:
     * - Verifies the user exists
     * - Deletes the user from the database
     *
     * @param login The login of the user to delete
     * @return UserDto containing the deleted user's information
     * @throws UserNotFoundByLoginException if the user is not found
     * @throws UserDeletionException if the deletion fails
     */
    public UserDto deleteUserByLogin(String login) {
        try {
            // Get the user to delete
            User userToDelete = userRepository.findByLogin(login)
                .orElseThrow(() -> new UserNotFoundByLoginException(login));

            // Delete the user
            userRepository.deleteById(userToDelete.getId());
            return userMapper.toUserDto(userToDelete);
        } catch (UserNotFoundByLoginException e) {
            throw e;
        } catch (Exception e) {
            throw new UserDeletionException(e.getMessage());
        }
    }

    /**
     * Permanently deletes a user from the system by login.
     * This method:
     * - Verifies the user exists
     * - Deletes the user from the database
     *
     * @param login The login of the user to delete
     * @return UserDto containing the deleted user's information
     * @throws UserNotFoundByLoginException if the user is not found
     * @throws UserDeletionException if the permanent deletion fails
     */
    public UserDto deleteUserPermanentByLogin(String login) {
        try {
            // Get the user to delete
            User userToDelete = userRepository.findByLogin(login)
                .orElseThrow(() -> new UserNotFoundByLoginException(login));

            // Delete the user
            userRepository.deletePermanentlyById(userToDelete.getId());
            return userMapper.toUserDto(userToDelete);
        } catch (UserNotFoundByLoginException e) {
            throw e;
        } catch (Exception e) {
            throw new PermanentUserDeletionException(e.getMessage());
        }
    }

    /**
     * Finds a user by their login.
     * This method:
     * - Searches the database for a user with the specified login
     * - Throws an exception if the user is not found
     * - Maps the User entity to a UserDto
     *
     * @param login The login of the user to find
     * @return UserDto containing the user's information
     * @throws AppException if the user is not found
     */
    public UserDto findByLogin(String login) {
        log.debug("Searching for user with login: {}", login);
        try {
            Optional<User> userOptional = userRepository.findByLogin(login);
            log.debug("User found in database: {}", userOptional.isPresent());

            User user = userOptional
                    .orElseThrow(() -> {
                        log.error("User not found with login: {}", login);
                        return new UserNotFoundByLoginException(login);
                    });

            if (user.isDeleted()) {
                throw new InactiveUserException("user.inactive.orDeleted");
            }

            log.debug("User details - ID: {}, FirstName: {}, LastName: {}, Roles: {}",
                    user.getId(), user.getFirstName(), user.getLastName(),
                    user.getMainRole());

            UserDto userDto = userMapper.toUserDto(user);
            log.debug("Mapped to UserDto - ID: {}, FirstName: {}, LastName: {}, Role: {}",
                    userDto.getId(), userDto.getFirstName(), userDto.getLastName(), userDto.getMainRole());

            return userDto;
        } catch (UserNotFoundByLoginException | InactiveUserException e) {
            throw e;
        } catch (Exception e) {
            throw new UserRetrievalException(e.getMessage());
        }
    }

    /**
     * Deletes a user globally (via AuthClient) and locally.
     * This method:
     * - Calls the AuthClient to delete user from the global auth service
     * - Validates the response contains the deleted user login
     * - Deletes the user locally by login
     * - Returns the deletion message
     *
     * @param token  The authorization token
     * @param userId The ID of the user to delete
     * @return Message from the global deletion response
     * @throws UserDeletionException if the deletion fails or response is invalid
     */
    public reactor.core.publisher.Mono<String> deleteGlobalAndLocal(String token, String userLogin) {
        return authClient.deleteGlobalUser(token, userLogin)
                .flatMap(response -> {
                    java.util.Map<String, String> body = response.getBody();
                    if (body != null && body.containsKey("deletedUserLogin")) {
                        deleteUserByLogin(body.get("deletedUserLogin"));
                        return reactor.core.publisher.Mono.just(body.get("message"));
                    } else {
                        return reactor.core.publisher.Mono.error(
                            new UserDeletionException("user.delete.failed.missingResponse", true));
                    }
                });
    }

    /**
     * Permanently deletes a user globally (via AuthClient) and locally.
     * This method:
     * - Calls the AuthClient to permanently delete user from the global auth service
     * - Validates the response contains the deleted user login
     * - Permanently deletes the user locally by login
     * - Returns the deletion message
     *
     * @param token  The authorization token
     * @param userId The ID of the user to permanently delete
     * @return Message from the global deletion response
     * @throws UserDeletionException if the deletion fails or response is invalid
     */
    public reactor.core.publisher.Mono<String> deleteGlobalAndLocalPermanent(String token, String userLogin) {
        return authClient.deleteGlobalUserPermanent(token, userLogin)
                .flatMap(response -> {
                    java.util.Map<String, String> body = response.getBody();
                    if (body != null && body.containsKey("deletedUserLogin")) {
                        deleteUserPermanentByLogin(body.get("deletedUserLogin"));
                        return reactor.core.publisher.Mono.just(body.get("message"));
                    } else {
                        return reactor.core.publisher.Mono.error(
                            new UserDeletionException("user.delete.failed.missingResponse", true));
                    }
                });
    }

    public UserDto getOrCreateUser(UserDto userDto){
        
        Optional<User> optionalUser = userRepository.findByLogin(userDto.getLogin());
        
        Role role = roleRepository.findByName(RoleEnum.valueOf(userDto.getMainRole()))
        .orElseThrow(() -> new RoleNotFoundException());

        Set<Role> appSpecificRoles = new HashSet<Role>();
        
        appSpecificRoles.add(role);

        if(optionalUser.isEmpty()){
            appSpecificRoles.add(role);
            
            User newUser = User.builder()
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .login(userDto.getLogin())
                .mainRole(role)
                .appSpecificRoles(appSpecificRoles)
                .build();

            userRepository.save(newUser);
            return userMapper.toUserDto(newUser);
        }

        return userMapper.toUserDto(optionalUser.get());
    }
}

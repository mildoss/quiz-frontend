package eugenestellar.quiz.service;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import eugenestellar.quiz.exception.*;
import eugenestellar.quiz.model.Role;
import eugenestellar.quiz.model.dto.AuthUserDto;
import eugenestellar.quiz.model.dto.ResponseTokenAndInfoDto;
import eugenestellar.quiz.model.entity.User;
import eugenestellar.quiz.repository.UserRepo;
import eugenestellar.quiz.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

  private static final Logger log = LoggerFactory.getLogger(AuthService.class);

  private final UserRepo userRepo;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;

  private final WebClient webClient;

  public AuthService(JwtUtil jwtUtil, UserRepo userRepo, PasswordEncoder passwordEncoder, WebClient webClient) {
    this.jwtUtil = jwtUtil;
    this.userRepo = userRepo;
    this.passwordEncoder = passwordEncoder;
    this.webClient = webClient;
  }

  @Value("${GAME_SERVICE_URL}")
  private String gameServiceUrl;

  public ResponseTokenAndInfoDto register(AuthUserDto userDto) {

    String username = userDto.getUsername();

    if (userRepo.findByUsername(username).isPresent())
      throw new UsernameAlreadyExistException("This username has been already taken");

    // create user in order to save it in DB
    User userForDb = new User();
    userForDb.setPassword(passwordEncoder.encode(userDto.getPassword()));
    userForDb.setUsername(username);
    User savedUser = userRepo.save(userForDb);
    String tokenForGameService = jwtUtil.generateServiceToken(List.of(Role.ROLE_AUTH_SERVICE.name()));

      try {
        webClient.post()
            .uri(gameServiceUrl + "/user_info/" + savedUser.getId())
            .header("Authorization", "Bearer " + tokenForGameService)
            .bodyValue(Map.of("username", savedUser.getUsername()))
            .retrieve()
            .toBodilessEntity()
            .block();

        String token = jwtUtil.generateToken(savedUser.getId(), username, true, List.of(Role.ROLE_USER.name()));
        return new ResponseTokenAndInfoDto(token, savedUser.getId(), username);
      } catch (WebClientResponseException e) {
        // if game-backend service returned 4xx or 5xx
        userRepo.delete(savedUser);
        log.error("Game Service error: Status {}, Body {}", e.getStatusCode(), e.getResponseBodyAsString());
        throw new ProfileCreationException("Profile creation failed. Try again later. Status: " + e.getStatusCode());
      } catch (Exception e) {
        // if game-backend service is unreachable(Connection refused)
        userRepo.delete(savedUser);
        log.error("Game-backend-service is unreachable: {}", e.getMessage());
        throw new RuntimeException("Game service is currently unavailable.");
      }
  }

  public ResponseCookie setRefreshTokenInCookie(String username) {

    return ResponseCookie.from("refresh-token", jwtUtil.generateToken(null, username, false, null))
        .httpOnly(true)
        .secure(true)
        .sameSite("None") // for cross-domain access
        .path("/") // cookie scope i.e. which paths will be the cookie send to, /auth by default(matched with Controller path)
        .maxAge(Duration.ofDays(30))
        .build();
  }

  public ResponseTokenAndInfoDto login(AuthUserDto userDto) {

    String username = userDto.getUsername();

    Optional<User> userFromDbOptional = userRepo.findByUsername(username);

    if (userFromDbOptional.isEmpty())
      throw new NotFoundUserOrIncorrectPasswordException("There's no user with a name " + username);

    User userFromDb = userFromDbOptional.get();

    if (!passwordEncoder.matches(userDto.getPassword(), userFromDb.getPassword()))
      throw new NotFoundUserOrIncorrectPasswordException("The password is incorrect");

    String token = jwtUtil.generateToken(userFromDb.getId(), username, true, List.of(Role.ROLE_USER.name()));

    return new ResponseTokenAndInfoDto(token, userFromDb.getId(), username);

  }

  public ResponseTokenAndInfoDto getNewAccessToken(String refreshToken) {
    try {
      DecodedJWT jwt = jwtUtil.validateRefreshToken(refreshToken);
      String username = jwt.getSubject();

      User user = userRepo.findByUsername(username)
          .orElseThrow(() -> new UserNotFoundForTokenException("User not found with username: " + username));

      String accessToken = jwtUtil.generateToken(user.getId(), username, true, List.of(Role.ROLE_USER.name()));

      return new ResponseTokenAndInfoDto(accessToken, user.getId(), username);

    } catch (JWTVerificationException ex) {
      throw new ExpiredRefreshTokenException("Invalid or expired refresh token");
    }
  }
}
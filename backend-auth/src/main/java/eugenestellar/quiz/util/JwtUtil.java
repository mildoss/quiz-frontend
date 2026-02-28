package eugenestellar.quiz.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtil {

  @Value("${SECRET_WORD}")
  private String secret;

  public String generateToken(Long userId, String username, boolean accessToken, List<String> roles) {
    Date expirationDate = accessToken ? Date.from(ZonedDateTime.now().plusMinutes(15).toInstant())
    : Date.from(ZonedDateTime.now().plusDays(30).toInstant());

    var jwtBuilder = JWT.create() // JWTCreator.Builder is operational as well
        .withSubject(username)
        .withClaim("type", accessToken ? "access" : "refresh")
        .withIssuedAt(new Date())
        .withIssuer("auth-service")
        .withExpiresAt(expirationDate);
    if (accessToken && userId != null && roles != null && !roles.isEmpty()) { // roles & UserId for access token
      jwtBuilder.withClaim("roles", roles);
      jwtBuilder.withClaim("userId", userId);
    }

    return jwtBuilder.sign(Algorithm.HMAC256(secret));
  }

  public String generateServiceToken(List<String> roles) {
     return JWT.create()
        .withSubject("AuthBackendService")
        .withClaim("type", "service")
        .withClaim("roles", roles)
        .withIssuedAt(new Date())
        .withIssuer("auth-service")
        .withExpiresAt(Date.from(ZonedDateTime.now().plusMinutes(10).toInstant()))
        .sign(Algorithm.HMAC256(secret));
  }

  public DecodedJWT validateAccessToken(String token) throws JWTVerificationException {
    JWTVerifier verifier = JWT
        .require(Algorithm.HMAC256(secret))
        .withIssuer("auth-service")
        .withClaim("type", "access")
        .build();

    return verifier.verify(token);
  }

  public DecodedJWT validateRefreshToken(String token) throws JWTVerificationException {
    JWTVerifier verifier = JWT
        .require(Algorithm.HMAC256(secret))
        .withIssuer("auth-service")
        .withClaim("type", "refresh")
        .build();

    return verifier.verify(token);
  }
}
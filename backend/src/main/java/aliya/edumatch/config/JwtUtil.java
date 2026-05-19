package aliya.edumatch.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    // Секретный ключ для подписи токенов (в реальном проекте берется из application.properties)
    private final String SECRET_KEY = "my_super_secret_key_for_edumatch_project_university";
    // Токен будет жить 24 часа
    private final long EXPIRATION_TIME = 24 * 60 * 60 * 1000;

    // Генерируем токен, зашивая туда email, id и роль
    public String generateToken(Long userId, String email, String role) {
        return JWT.create()
                .withSubject(email)
                .withClaim("userId", userId)
                .withClaim("role", role)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(Algorithm.HMAC256(SECRET_KEY));
    }

    // Валидация токена
    public DecodedJWT validateToken(String token) {
        return JWT.require(Algorithm.HMAC256(SECRET_KEY))
                .build()
                .verify(token);
    }
}
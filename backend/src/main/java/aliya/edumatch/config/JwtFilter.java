package aliya.edumatch.config;

import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                // Расшифровываем токен нашей утилитой
                DecodedJWT decodedJWT = jwtUtil.validateToken(token);
                String email = decodedJWT.getSubject();
                String role = decodedJWT.getClaim("role").asString();

                System.out.println("DEBUG: JWT Validated! Email: " + email + ", Role from token: " + role);

                // Защита: создаем СРАЗУ ДВА варианта роли (с префиксом и без),
                // чтобы ни hasRole(), ни hasAuthority() в SecurityConfig не упали в 401!
                var authorities = java.util.List.of(
                        new SimpleGrantedAuthority(role),           // "USER"
                        new SimpleGrantedAuthority("ROLE_" + role)   // "ROLE_USER"
                );

                // Создаем объект авторизации для Spring Security
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        authorities
                );

                // Сетим пользователя в контекст Spring
                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("DEBUG: Context successfully set in Spring Security for: " + email);

            } catch (Exception e) {
                // 🔥 ВАЖНО: Выводим реальную ошибку парсинга токена в консоль Java!
                System.err.println("🔥 JWT FILTER ERROR: Token validation failed! Reason: " + e.getMessage());
                e.printStackTrace();
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}


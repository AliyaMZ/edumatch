package aliya.edumatch.config;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor // 🔥 ИСПРАВЛЕНО: Безопасное внедрение зависимостей через конструктор (вместо @Autowired)
public class SecurityConfig {

    // 🔥 ИСПРАВЛЕНО: Делаем поле final, чтобы Lombok внедрил его через конструктор.
    // Это гарантирует, что фильтр инициализируется ДО создания цепочки SecurityFilterChain.
    private final JwtFilter jwtFilter;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:5173",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:5173"
        ));
        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        // 🔥 ИСПРАВЛЕНО: Вместо "*" явно разрешаем Authorization заголовок, так как установлен allowCredentials(true)
        corsConfiguration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control", "X-Requested-With"));
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setMaxAge(1800L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        // 1. Разрешаем публичные API
                        .requestMatchers("/api/courses/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        // 2. Разрешаем системный путь ошибок, чтобы он не требовал авторизации
                        .requestMatchers("/error").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // 3. Защищенные пути
                        .requestMatchers("/api/users/**").hasAnyAuthority("USER", "ROLE_USER")
                        .anyRequest().authenticated()
                )
                // Добавляем обработчик ошибок, чтобы видеть, ЧТО именно не нравится Spring
                .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) -> {
                    System.err.println("DEBUG: Security blocked request: " + request.getRequestURI());
                    System.err.println("DEBUG: Reason: " + authException.getMessage());
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                }))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

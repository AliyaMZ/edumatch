package aliya.edumatch.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.http.HttpMethod;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:5173",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:5173"
        ));
        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        corsConfiguration.setAllowedHeaders(Arrays.asList("*")); // Упрощаем для теста, разрешаем все заголовки
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setMaxAge(1800L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(source);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Включаем CORS и передаем наш фильтр
                .addFilterBefore(corsFilter(), UsernamePasswordAuthenticationFilter.class)

                // 2. Отключаем CSRF, так как используем stateless REST API
                .csrf(csrf -> csrf.disable())

                // 3. ЯВНО отключаем базовую и формовую авторизацию Spring
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())

                // 4. Настраиваем доступы к эндпоинтам
                .authorizeHttpRequests(auth -> auth
                        // Разрешаем запросы к авторизации и пользователям
                        .requestMatchers("/api/auth/**", "/api/users/**").permitAll()

                        // 🔥 ДОБАВЛЕНО: Разрешаем GET-запросы к курсам для всех (публичный просмотр)
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/courses/**").permitAll()

                        // Все остальные запросы (POST/DELETE для курсов, админка, приватные эндпоинты) требуют токен
                        .anyRequest().authenticated()
                )

                // 5. Переопределяем поведение при ошибках, возвращая 401 JSON
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Access Denied\"}");
                        })
                );

        return http.build();
    }
}
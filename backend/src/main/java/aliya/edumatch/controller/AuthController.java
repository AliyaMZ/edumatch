package aliya.edumatch.controller;

import aliya.edumatch.dto.*;
import aliya.edumatch.model.User;
import aliya.edumatch.repository.UserRepository;
import aliya.edumatch.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // 1. РЕГИСТРАЦИЯ
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Проверяем, существует ли уже такой email
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Этот email уже занят!"));
        }

        // Создаем нового пользователя
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        // Хешируем пароль перед сохранением в БД!
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER"); // По умолчанию обычный пользователь

        userRepository.save(user);

        // Генерируем токен для мгновенного входа после регистрации
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());
        return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getRole()));
    }

    // 2. ВХОД (ЛОГИН)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Ищем пользователя по email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Пользователь с таким email не найден"));

        // Проверяем совпадение паролей
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Неверный пароль!"));
        }

        // Если всё успешно, выпускаем токен
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());
        return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getRole()));
    }
}
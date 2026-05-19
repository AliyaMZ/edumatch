package aliya.edumatch.service;

import aliya.edumatch.model.User;
import aliya.edumatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // 🔑 Инжектим энкодер из SecurityConfig

    // ✅ Регистрация: шифруем пароль перед сохранением
    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email уже зарегистрирован");
        }

        // 🔐 Хешируем "сырой" пароль
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        return userRepository.save(user);
    }

    // ✅ Логин: сравниваем введённый пароль с хешем из БД
    public User login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));

        // 🔐 matches() автоматически проверяет соответствие хеша
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("Неверный пароль");
        }

        return user;
    }
}
package aliya.edumatch.controller;

import aliya.edumatch.model.Course;
import aliya.edumatch.model.User;
import aliya.edumatch.model.UserCourse;
import aliya.edumatch.repository.CourseRepository;
import aliya.edumatch.repository.UserRepository;
import aliya.edumatch.repository.UserCourseRepository;
import aliya.edumatch.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserCourseRepository userCourseRepository;

    @Autowired
    private UserService userService;  // 🔐 НОВОЕ: сервис для безопасной аутентификации

    // =================================================================
    // 1. РЕГИСТРАЦИЯ (обновлено: хеширование пароля через UserService)
    // =================================================================
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            // Базовая валидация
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email обязателен"));
            }
            if (user.getPassword() == null || user.getPassword().length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("error", "Пароль должен быть не менее 6 символов"));
            }

            // Установка значений по умолчанию
            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("USER");
            }
            if (user.getFavoriteCourses() == null) {
                user.setFavoriteCourses(new HashSet<>());
            }

            // 🔐 ДЕЛЕГИРУЕМ В СЕРВИС: пароль будет захеширован через BCrypt
            User savedUser = userService.register(user);

            // Не возвращаем хеш пароля в ответе (безопасность!)
            savedUser.setPassword(null);

            return ResponseEntity.status(201).body(Map.of(
                    "message", "Пользователь успешно зарегистрирован",
                    "user", savedUser
            ));

        } catch (IllegalArgumentException e) {
            // Например: "Email уже зарегистрирован"
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // =================================================================
    // 2. ЛОГИН (обновлено: проверка пароля через BCrypt)
    // =================================================================
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        // Валидация входных данных
        if (email == null || email.isEmpty() || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email и пароль обязательны"));
        }

        try {
            // 🔐 ДЕЛЕГИРУЕМ В СЕРВИС: пароль проверится через passwordEncoder.matches()
            User user = userService.login(email, password);

            // Создаём безопасный ответ без пароля
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("email", user.getEmail());
            userData.put("username", user.getUsername());
            userData.put("role", user.getRole());
            userData.put("goal", user.getGoal());
            userData.put("level", user.getLevel());

            return ResponseEntity.ok(Map.of(
                    "message", "Вход успешен",
                    "user", userData
                    // Позже здесь добавим: "token", jwtToken
            ));

        } catch (IllegalArgumentException e) {
            // "Пользователь не найден" или "Неверный пароль"
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    // =================================================================
    // 3. ОБНОВЛЕНИЕ ПРОФИЛЯ (ИСПРАВЛЕНО: Hibernate Dirty Checking Fix)
    // =================================================================
    @PutMapping("/{id}/profile")
    @Transactional
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody User profileData) {
        return userRepository.findById(id).map(user -> {
            // 1. Обновляем поля
            user.setGoal(profileData.getGoal());
            user.setLevel(profileData.getLevel());
            user.setHoursPerWeek(profileData.getHoursPerWeek());
            user.setBudget(profileData.getBudget());
            user.setPreferredFormats(profileData.getPreferredFormats());
            user.setInterests(profileData.getInterests());

            if (profileData.getUsername() != null) {
                user.setUsername(profileData.getUsername());
            }

            // 2. Сохраняем в базу данных
            User updated = userRepository.save(user);

            // 3. Чтобы Hibernate не занулял пароль в БД, собираем чистый ответ через Map!
            Map<String, Object> safeUserResponse = new HashMap<>();
            safeUserResponse.put("id", updated.getId());
            safeUserResponse.put("email", updated.getEmail());
            safeUserResponse.put("username", updated.getUsername());
            safeUserResponse.put("role", updated.getRole());
            safeUserResponse.put("goal", updated.getGoal());
            safeUserResponse.put("level", updated.getLevel());
            safeUserResponse.put("hoursPerWeek", updated.getHoursPerWeek());
            safeUserResponse.put("budget", updated.getBudget());
            safeUserResponse.put("preferredFormats", updated.getPreferredFormats());
            safeUserResponse.put("interests", updated.getInterests());

            return ResponseEntity.ok(Map.of(
                    "message", "Профиль обновлён",
                    "user", safeUserResponse
            ));
        }).orElse(ResponseEntity.notFound().build());
    }

    // =================================================================
    // 4. ПОЛУЧЕНИЕ ИЗБРАННЫХ КУРСОВ С ПРОГРЕССОМ (оставляем как есть)
    // =================================================================
    @GetMapping("/{id}/favorites")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getUserFavorites(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            List<UserCourse> progressList = userCourseRepository.findByUserId(id);

            List<Map<String, Object>> response = user.getFavoriteCourses().stream().map(course -> {
                Map<String, Object> courseMap = new HashMap<>();
                courseMap.put("id", course.getId());
                courseMap.put("title", course.getTitle());
                courseMap.put("description", course.getDescription());
                courseMap.put("price", course.getPrice());
                courseMap.put("aiAnalysis", course.getAiAnalysis());
                courseMap.put("url", course.getUrl());

                UserCourse progress = progressList.stream()
                        .filter(p -> p.getCourse().getId().equals(course.getId()))
                        .findFirst()
                        .orElse(null);

                courseMap.put("progress", progress != null ? progress.getProgress() : 0);
                courseMap.put("status", progress != null ? progress.getStatus() : "not_started");

                return courseMap;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }

    // =================================================================
    // 5. ОБНОВЛЕНИЕ ПРОГРЕССА (оставляем как есть)
    // =================================================================
    @PutMapping("/{userId}/courses/{courseId}/progress")
    @Transactional
    public ResponseEntity<?> updateCourseProgress(
            @PathVariable Long userId,
            @PathVariable Long courseId,
            @RequestBody Map<String, Object> updates) {

        UserCourse userCourse = userCourseRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId).orElseThrow();
                    Course course = courseRepository.findById(courseId).orElseThrow();
                    UserCourse uc = new UserCourse();
                    uc.setUser(user);
                    uc.setCourse(course);
                    return uc;
                });

        if (updates.containsKey("progress")) {
            userCourse.setProgress((Integer) updates.get("progress"));
        }
        if (updates.containsKey("status")) {
            userCourse.setStatus((String) updates.get("status"));
        }

        userCourseRepository.save(userCourse);
        return ResponseEntity.ok(Map.of("message", "Прогресс обновлён"));
    }

    // =================================================================
    // 6. ДОБАВЛЕНИЕ В ИЗБРАННОЕ (оставляем как есть)
    // =================================================================
    @PostMapping("/{userId}/favorites/{courseId}")
    @Transactional
    public ResponseEntity<?> addCourseToFavorites(@PathVariable Long userId, @PathVariable Long courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Курс не найден"));

        user.getFavoriteCourses().add(course);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Курс добавлен в избранное"));
    }

    // =================================================================
    // 7. УДАЛЕНИЕ ИЗ ИЗБРАННОГО (оставляем как есть)
    // =================================================================
    @DeleteMapping("/{userId}/favorites/{courseId}")
    @Transactional
    public ResponseEntity<?> removeCourseFromFavorites(@PathVariable Long userId, @PathVariable Long courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        boolean removed = user.getFavoriteCourses().removeIf(c -> c.getId().equals(courseId));

        if (removed) {
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Курс удалён из избранного"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Курс не найден в избранном"));
    }

    // =================================================================
    // 8. ПОЛУЧЕНИЕ ПОЛЬЗОВАТЕЛЯ ПО ID (оставляем как есть)
    // =================================================================
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setPassword(null); // Не возвращаем пароль
                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
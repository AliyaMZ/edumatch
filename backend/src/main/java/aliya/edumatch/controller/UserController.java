package aliya.edumatch.controller;

import aliya.edumatch.model.Course;
import aliya.edumatch.model.User;
import aliya.edumatch.model.UserCourse;
import aliya.edumatch.repository.CourseRepository;
import aliya.edumatch.repository.UserRepository;
import aliya.edumatch.repository.UserCourseRepository; // Добавить этот импорт
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserCourseRepository userCourseRepository; // Добавлено для работы с прогрессом

    // 1. РЕГИСТРАЦИЯ
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        if (user.getFavoriteCourses() == null) {
            user.setFavoriteCourses(new java.util.HashSet<>());
        }
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    // 2. ЛОГИН
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginData) {
        return userRepository.findAll().stream()
                .filter(user -> user.getEmail().equalsIgnoreCase(loginData.getEmail()))
                .findFirst()
                .map(user -> {
                    if (user.getPassword().equals(loginData.getPassword())) {
                        return ResponseEntity.ok(user);
                    } else {
                        return ResponseEntity.status(401).body("Неверный пароль");
                    }
                })
                .orElse(ResponseEntity.status(404).body("Пользователь не найден"));
    }

    // 3. ОБНОВЛЕНИЕ ПРОФИЛЯ
    @PutMapping("/{id}/profile")
    @Transactional
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody User profileData) {
        return userRepository.findById(id).map(user -> {
            user.setGoal(profileData.getGoal());
            user.setLevel(profileData.getLevel());
            user.setHoursPerWeek(profileData.getHoursPerWeek());
            user.setBudget(profileData.getBudget());
            user.setPreferredFormats(profileData.getPreferredFormats());
            user.setInterests(profileData.getInterests());
            // Обновляем имя, если оно пришло
            if (profileData.getUsername() != null) user.setUsername(profileData.getUsername());

            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. ПОЛУЧЕНИЕ ИЗБРАННЫХ КУРСОВ С ПРОГРЕССОМ (Обновлено)
    @GetMapping("/{id}/favorites")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getUserFavorites(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            // Загружаем все записи прогресса пользователя за один раз
            List<UserCourse> progressList = userCourseRepository.findByUserId(id);

            // Превращаем Set<Course> в список объектов с прогрессом
            List<Map<String, Object>> response = user.getFavoriteCourses().stream().map(course -> {
                Map<String, Object> courseMap = new HashMap<>();
                courseMap.put("id", course.getId());
                courseMap.put("title", course.getTitle());
                courseMap.put("description", course.getDescription());
                courseMap.put("price", course.getPrice());
                courseMap.put("aiAnalysis", course.getAiAnalysis());
                courseMap.put("url", course.getUrl());

                // Ищем прогресс для конкретного курса в списке
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

    // 5. ОБНОВЛЕНИЕ ПРОГРЕССА (Новый метод)
    @PutMapping("/{userId}/courses/{courseId}/progress")
    @Transactional
    public ResponseEntity<?> updateCourseProgress(
            @PathVariable Long userId,
            @PathVariable Long courseId,
            @RequestBody Map<String, Object> updates) {

        UserCourse userCourse = userCourseRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseGet(() -> {
                    // Если записи о прогрессе нет, создаем новую связь
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
        return ResponseEntity.ok("Прогресс обновлен");
    }

    // 6. ДОБАВЛЕНИЕ В ИЗБРАННОЕ
    @PostMapping("/{userId}/favorites/{courseId}")
    @Transactional
    public ResponseEntity<?> addCourseToFavorites(@PathVariable Long userId, @PathVariable Long courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Курс не найден"));

        user.getFavoriteCourses().add(course);
        userRepository.save(user);
        return ResponseEntity.ok("Курс добавлен в избранное");
    }

    // 7. УДАЛЕНИЕ ИЗ ИЗБРАННОГО
    @DeleteMapping("/{userId}/favorites/{courseId}")
    @Transactional
    public ResponseEntity<?> removeCourseFromFavorites(@PathVariable Long userId, @PathVariable Long courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        boolean removed = user.getFavoriteCourses().removeIf(c -> c.getId().equals(courseId));

        if (removed) {
            userRepository.save(user);
            return ResponseEntity.ok("Курс удален из избранного");
        }
        return ResponseEntity.badRequest().body("Курс не найден в избранном");
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
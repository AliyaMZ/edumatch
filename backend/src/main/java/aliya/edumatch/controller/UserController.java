package aliya.edumatch.controller;

import aliya.edumatch.model.Course;
import aliya.edumatch.model.User;
import aliya.edumatch.model.UserCourse;
import aliya.edumatch.repository.CourseRepository;
import aliya.edumatch.repository.UserRepository;
import aliya.edumatch.repository.UserCourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import aliya.edumatch.dto.UserUpdateDTO;

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

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setPassword(null);
                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/profile")
    @Transactional
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody UserUpdateDTO profileData) {
        return userRepository.findById(id).map(user -> {
            // Обновляем данные
            if (profileData.getUsername() != null) user.setUsername(profileData.getUsername());
            if (profileData.getGoal() != null) user.setGoal(profileData.getGoal());
            if (profileData.getLevel() != null) user.setLevel(profileData.getLevel());
            if (profileData.getHoursPerWeek() != null) user.setHoursPerWeek(profileData.getHoursPerWeek());
            if (profileData.getBudget() != null) user.setBudget(profileData.getBudget());

            // Сохраняем и сразу сбрасываем в базу
            User savedUser = userRepository.saveAndFlush(user);

            savedUser.setPassword(null);
            return ResponseEntity.ok(savedUser);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/favorites")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getUserFavorites(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            List<UserCourse> progressList = userCourseRepository.findByUserId(id);

            List<Map<String, Object>> response = user.getFavoriteCourses().stream().map(course -> {
                Map<String, Object> courseMap = new HashMap<>();
                courseMap.put("id", course.getId());
                courseMap.put("title", course.getTitle());

                UserCourse userCourse = progressList.stream()
                        .filter(p -> p.getCourse().getId().equals(course.getId()))
                        .findFirst()
                        .orElse(null);

                courseMap.put("progress", userCourse != null ? userCourse.getProgress() : 0);
                // 🔥 ВАЖНО: Добавили передачу статуса
                courseMap.put("status", userCourse != null ? userCourse.getStatus() : "not_started");

                return courseMap;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}/courses/{courseId}/progress")
    @Transactional
    public ResponseEntity<?> updateCourseProgress(
            @PathVariable Long userId,
            @PathVariable Long courseId,
            @RequestBody Map<String, Object> updates) {

        return userCourseRepository.findByUserIdAndCourseId(userId, courseId)
                .map(userCourse -> {
                    // Если запись есть — обновляем
                    if (updates.containsKey("progress")) userCourse.setProgress((Integer) updates.get("progress"));
                    if (updates.containsKey("status")) userCourse.setStatus((String) updates.get("status"));
                    userCourseRepository.save(userCourse);
                    return ResponseEntity.ok(Map.of("message", "Прогресс обновлён"));
                })
                .orElseGet(() -> {
                    // Если записи нет — создаем новую
                    User user = userRepository.findById(userId).orElse(null);
                    Course course = courseRepository.findById(courseId).orElse(null);

                    if (user == null || course == null) return ResponseEntity.notFound().build();

                    UserCourse newUserCourse = new UserCourse();
                    newUserCourse.setUser(user);
                    newUserCourse.setCourse(course);
                    newUserCourse.setProgress((Integer) updates.getOrDefault("progress", 0));
                    newUserCourse.setStatus((String) updates.getOrDefault("status", "in_progress"));

                    userCourseRepository.save(newUserCourse);
                    return ResponseEntity.ok(Map.of("message", "Прогресс создан и обновлён"));
                });
    }

    @PostMapping("/{userId}/favorites/{courseId}")
    @Transactional
    public ResponseEntity<?> addCourseToFavorites(@PathVariable Long userId, @PathVariable Long courseId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Course> courseOpt = courseRepository.findById(courseId);

        if (userOpt.isEmpty() || courseOpt.isEmpty()) return ResponseEntity.notFound().build();

        User user = userOpt.get();
        user.getFavoriteCourses().add(courseOpt.get());
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Курс добавлен"));
    }

    @DeleteMapping("/{userId}/favorites/{courseId}")
    @Transactional
    public ResponseEntity<?> removeCourseFromFavorites(@PathVariable Long userId, @PathVariable Long courseId) {
        return userRepository.findById(userId).map(user -> {
            // Пытаемся удалить
            boolean removed = user.getFavoriteCourses().removeIf(c -> c.getId().equals(courseId));

            // Даже если курс не был найден в коллекции, мы все равно можем вернуть успех,
            // либо оставить текущую логику, если это критично для фронтенда.
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Курс удален или уже отсутствовал"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
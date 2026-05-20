package aliya.edumatch.controller;

import aliya.edumatch.model.Course;
import aliya.edumatch.model.UserCourse;
import aliya.edumatch.repository.CourseRepository;
import aliya.edumatch.repository.UserCourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserCourseRepository userCourseRepository;

    // 1. ПОЛУЧИТЬ ВСЕ КУРСЫ (С фильтрами)
    @GetMapping
    public List<Course> getCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double maxPrice) {

        List<Course> allCourses = courseRepository.findAll();

        return allCourses.stream()
                .filter(c -> search == null || c.getTitle().toLowerCase().contains(search.toLowerCase()))
                .filter(c -> {
                    if (maxPrice == null) return true;
                    if (c.getPrice() == null) return true; // ✨ ОПТИМИЗАЦИЯ: защита от NullPointerException
                    try {
                        // Очистка строки цены от лишних символов (₽, $, пробелы) для корректного сравнения
                        String priceStr = c.getPrice().replaceAll("[^0-9]", "");
                        return Double.parseDouble(priceStr) <= maxPrice;
                    } catch (Exception e) {
                        return true; // Если цену нельзя распарсить, не отфильтровываем
                    }
                })
                .collect(Collectors.toList());
    }

    // 2. ПОЛУЧИТЬ КУРС ПО ID
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. СОЗДАНИЕ КУРСА
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')") // Защищено: только для ADMIN
    public Course createCourse(@RequestBody Course course) {
        return courseRepository.save(course);
    }

    // 4. УДАЛЕНИЕ КУРСА ИЗ СИСТЕМЫ
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')") // Защищено: только для ADMIN
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        return courseRepository.findById(id).map(course -> {
            try {
                courseRepository.delete(course);
                return ResponseEntity.ok().<Void>build();
            } catch (Exception e) {
                // Если курс в избранном у кого-то, возникнет ошибка FK Constraint
                return ResponseEntity.status(409).body("Нельзя удалить курс, который находится в избранном у пользователей");
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    // 🔥 ДОБАВИТЬ ЭТОТ МЕТОД В CourseController
    // 🔥 ОБНОВЛЕННЫЙ МЕТОД: Безопасная работа с дублями
    @GetMapping("/{courseId}/user/{userId}")
    public ResponseEntity<Course> getCourseDetailsForUser(@PathVariable Long courseId, @PathVariable Long userId) {
        System.out.println("DEBUG: Запрос деталей курса " + courseId + " для юзера " + userId);

        return courseRepository.findById(courseId)
                .map(course -> {
                    try {
                        // Используем метод, который возвращает List, чтобы избежать ошибки "non-unique result"
                        List<UserCourse> records = userCourseRepository.findByUserIdAndCourseIdList(userId, courseId);

                        if (!records.isEmpty()) {
                            // Берем первую запись, если их вдруг оказалось несколько
                            UserCourse uc = records.get(0);
                            String analysis = uc.getAiAnalysis();

                            if (analysis != null && !analysis.isEmpty()) {
                                course.setAiAnalysis(analysis);
                                System.out.println("DEBUG: Анализ ИИ успешно прикреплен к курсу. (Запись ID: " + uc.getId() + ")");
                            }
                        } else {
                            System.out.println("DEBUG: Запись UserCourse не найдена для пользователя " + userId);
                        }
                    } catch (Exception e) {
                        System.err.println("DEBUG: Ошибка при обработке рекомендаций: " + e.getMessage());
                    }

                    return ResponseEntity.ok(course);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

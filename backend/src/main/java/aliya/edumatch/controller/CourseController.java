package aliya.edumatch.controller;

import aliya.edumatch.model.Course;
import aliya.edumatch.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

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

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        return courseRepository.save(course);
    }

    // 4. УДАЛЕНИЕ КУРСА ИЗ СИСТЕМЫ
    @DeleteMapping("/{id}")
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
}

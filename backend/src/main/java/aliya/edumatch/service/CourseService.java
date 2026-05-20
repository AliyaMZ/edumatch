package aliya.edumatch.service;

import aliya.edumatch.dto.CourseResponse;
import aliya.edumatch.model.Course;
import aliya.edumatch.model.UserCourse;
import aliya.edumatch.repository.CourseRepository;
import aliya.edumatch.repository.UserCourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserCourseRepository userCourseRepository;

    @Transactional(readOnly = true)
    public CourseResponse getCourseDetailsForUser(Long courseId, Long userId) {
        // 1. Ищем курс в БД
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Курс не найден"));

        // 2. Ищем персональную рекомендацию ИИ для этого пользователя
        Optional<UserCourse> aiRecommendation = userCourseRepository.findByUserIdAndCourseId(userId, courseId);

        // 3. Собираем DTO ответа
        CourseResponse.CourseResponseBuilder responseBuilder = CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .price(course.getPrice())
                .format(course.getFormat())
                .durationWeeks(course.getDurationWeeks()) // 🔥 Подставили durationWeeks
                .url(course.getUrl());

        // Если ИИ уже анализировал курс для этого юзера, берём данные оттуда
        if (aiRecommendation.isPresent()) {
            UserCourse uc = aiRecommendation.get();
            responseBuilder.matchPercent(uc.getMatchPercent());
            responseBuilder.aiAnalysis(uc.getAiAnalysis()); // Персональный текст от ИИ
        } else {
            responseBuilder.matchPercent(null);
            responseBuilder.aiAnalysis(null);
        }

        return responseBuilder.build();
    }
}
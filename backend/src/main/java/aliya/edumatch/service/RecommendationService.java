package aliya.edumatch.service;

import aliya.edumatch.dto.AiRecommendationResponse;
import aliya.edumatch.dto.CourseResponse; // 🔥 Добавили импорт DTO
import aliya.edumatch.model.Course;
import aliya.edumatch.model.User;
import aliya.edumatch.model.UserCourse;
import aliya.edumatch.repository.CourseRepository;
import aliya.edumatch.repository.UserCourseRepository;
import aliya.edumatch.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final UserCourseRepository userCourseRepository;
    private final ChatModel chatModel;
    private final ObjectMapper objectMapper;

    @Transactional
    // 🔥 ИСПРАВЛЕНО: Теперь возвращаем List<CourseResponse> вместо List<UserCourse>
    public List<CourseResponse> getOrCreateRecommendations(Long userId) {

        // 1. Проверяем кэшированные рекомендации
        List<UserCourse> existing = userCourseRepository.findByUserIdAndStatus(userId, "recommended");
        if (!existing.isEmpty()) {
            log.info("Найдены кэшированные рекомендации для пользователя с ID: {}", userId);
            return mapToCourseResponse(existing); // Конвертируем в DTO
        }

        // 2. Ищем пользователя в БД
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        // 3. Достаем все курсы для фильтрации
        List<Course> allCourses = courseRepository.findAll();
        if (allCourses.isEmpty()) {
            log.warn("В базе данных нет доступных курсов!");
            return new ArrayList<>();
        }

        // 🔥 УМНЫЙ ГИБРИДНЫЙ ФИЛЬТР: Бюджет + Ветвь IT / Интересы пользователя
        List<Course> filteredCourses = allCourses.stream()
                .filter(course -> {
                    if (user.getBudget() == null) {
                        return true;
                    }
                    if (course.getPrice() == null || course.getPrice().toString().isBlank()) {
                        return false;
                    }
                    try {
                        double coursePrice = Double.parseDouble(course.getPrice().toString().trim());
                        return coursePrice <= user.getBudget();
                    } catch (NumberFormatException e) {
                        log.warn("Не удалось распарсить цену для курса ID {}: {}", course.getId(), course.getPrice());
                        return false;
                    }
                })
                .filter(course -> {
                    String userContext = ((user.getInterests() != null ? user.getInterests() : "") + " " +
                            (user.getGoal() != null ? user.getGoal() : "")).toLowerCase();

                    if (userContext.isBlank()) {
                        return true;
                    }

                    String courseTitle = course.getTitle() != null ? course.getTitle().toLowerCase() : "";
                    String courseDesc = course.getDescription() != null ? course.getDescription().toLowerCase() : "";

                    if (userContext.contains("фронтенд") || userContext.contains("frontend") || userContext.contains("react")) {
                        return courseTitle.contains("front") || courseDesc.contains("front") ||
                                courseTitle.contains("react") || courseTitle.contains("javascript") ||
                                courseTitle.contains("css") || courseTitle.contains("html");
                    }

                    if (userContext.contains("бэкенд") || userContext.contains("backend") || userContext.contains("spring")) {
                        return courseTitle.contains("back") || courseDesc.contains("back") ||
                                courseTitle.contains("spring") || courseTitle.contains("java") ||
                                courseTitle.contains("python") || courseTitle.contains("sql");
                    }

                    if (userContext.contains("дизайн") || userContext.contains("design") || userContext.contains("ux")) {
                        return courseTitle.contains("дизайн") || courseDesc.contains("дизайн") ||
                                courseTitle.contains("figma") || courseTitle.contains("ui") || courseTitle.contains("ux");
                    }

                    if (userContext.contains("питон") || userContext.contains("python") || userContext.contains("django") || userContext.contains("flask")) {
                        return courseTitle.contains("python") || courseDesc.contains("python") ||
                                courseTitle.contains("питон") || courseDesc.contains("питон") ||
                                courseTitle.contains("django") || courseDesc.contains("django") ||
                                courseTitle.contains("flask") || courseDesc.contains("flask") ||
                                courseTitle.contains("fastapi") || courseDesc.contains("fastapi") ||
                                courseTitle.contains("pandas") || courseDesc.contains("pandas") ||
                                courseTitle.contains("data science") || courseDesc.contains("data science");
                    }

                    return courseTitle.contains(userContext) || courseDesc.contains(userContext);
                })
                .limit(4)
                .collect(Collectors.toList());

        if (filteredCourses.isEmpty()) {
            log.info("По фильтрам ключевых слов ничего не найдено. Применяем дефолтный список курсов.");
            filteredCourses = allCourses.stream().limit(3).collect(Collectors.toList());
        }

        log.info("Передаем на анализ ИИ {} курс(ов) из общего пула ({})", filteredCourses.size(), allCourses.size());

        // 4. Формируем безопасный промпт
        String userPrompt = String.format(
                "Ты — эксперт по профориентации. Твоя задача — сопоставить профиль студента с доступными курсами.\n\n" +
                        "Профиль студента:\n" +
                        "- Цель: %s\n" +
                        "- Текущий уровень: %s\n" +
                        "- Доступно часов в неделю: %s\n" +
                        "- Максимальный бюджет: %s рублей\n" +
                        "- Интересы: %s\n\n" +
                        "Список доступных курсов:\n%s\n\n" +
                        "Проанализируй каждый курс. Верни ответ СТРОГО в формате JSON-объекта, у которого есть ОДНО корневое поле \"recommendations\", содержащее массив объектов.\n\n" +
                        "СТРУКТУРА ОТВЕТА ДОЛЖНА БЫТЬ ТОЧНО ТАКОЙ:\n" +
                        "{\n" +
                        "  \"recommendations\": [\n" +
                        "    {\n" +
                        "      \"courseId\": 1,\n" +
                        "      \"matchPercent\": 85,\n" +
                        "      \"aiAnalysis\": \"Этот курс подходит, так как...\"\n" +
                        "    }\n" +
                        "  ]\n" +
                        "}\n\n" +
                        "Никакого другого текста, кроме этого JSON, не возвращай." +
                        "Пиши ответ СТРОГО на грамотном русском языке без иностранных слов.",
                user.getGoal(), user.getLevel(), user.getHoursPerWeek(), user.getBudget(),
                user.getInterests(), formatCoursesForAi(filteredCourses)
        );

        try {
            log.info("Отправляем запрос в Ollama...");
            long startTime = System.currentTimeMillis();

            String aiRawResponse = chatModel.call(userPrompt);

            long endTime = System.currentTimeMillis();
            log.info("Ollama успешно сгенерировала ответ за {} мс", (endTime - startTime));

            // 5. Десериализуем ответ в DTO
            String cleanedResponse = aiRawResponse.trim();
            if (cleanedResponse.contains("```json")) {
                cleanedResponse = cleanedResponse.substring(cleanedResponse.indexOf("```json") + 7);
                if (cleanedResponse.contains("```")) {
                    cleanedResponse = cleanedResponse.substring(0, cleanedResponse.indexOf("```"));
                }
            } else if (cleanedResponse.contains("```")) {
                cleanedResponse = cleanedResponse.substring(cleanedResponse.indexOf("```") + 3);
                if (cleanedResponse.contains("```")) {
                    cleanedResponse = cleanedResponse.substring(0, cleanedResponse.indexOf("```"));
                }
            }
            cleanedResponse = cleanedResponse.trim();

            System.out.println("👉 СЫРОЙ ОТВЕТ ОТ OLLAMA:\n" + cleanedResponse);

            List<AiRecommendationResponse> recommendations;

            if (cleanedResponse.startsWith("{")) {
                log.info("ИИ вернул ответ в формате JSON-Объекта. Парсим через обёртку AiWrapperResponse.");
                aliya.edumatch.dto.AiWrapperResponse wrapper = objectMapper.readValue(cleanedResponse, aliya.edumatch.dto.AiWrapperResponse.class);
                recommendations = wrapper.getRecommendations();
            } else {
                log.info("ИИ вернул ответ в формате JSON-Массива.");
                recommendations = objectMapper.readValue(
                        cleanedResponse,
                        new TypeReference<List<AiRecommendationResponse>>() {}
                );
            }

            if (recommendations == null) {
                recommendations = new ArrayList<>();
            }

            // 6. Сохраняем результаты в базу (С ПРОВЕРКОЙ НА ДУБЛИ)
            List<UserCourse> savedRecommendations = new ArrayList<>();

            for (AiRecommendationResponse rec : recommendations) {
                Course course = courseRepository.findById(rec.getCourseId()).orElse(null);
                if (course != null) {
                    List<UserCourse> existingRecords = userCourseRepository.findByUserIdAndCourseIdList(user.getId(), course.getId());

                    UserCourse userCourse;
                    if (!existingRecords.isEmpty()) {
                        userCourse = existingRecords.get(0);
                        userCourse.setMatchPercent(rec.getMatchPercent());
                        userCourse.setAiAnalysis(rec.getAiAnalysis());
                        log.info("Обновлена существующая рекомендация для курса ID: {}", course.getId());
                    } else {
                        userCourse = UserCourse.builder()
                                .user(user)
                                .course(course)
                                .status("recommended")
                                .progress(0)
                                .matchPercent(rec.getMatchPercent())
                                .aiAnalysis(rec.getAiAnalysis())
                                .build();
                        log.info("Создана новая рекомендация для курса ID: {}", course.getId());
                    }
                    // 🔥 ВАЖНО: Всегда добавляем в список, чтобы потом его вернуть
                    savedRecommendations.add(userCourseRepository.save(userCourse));
                }
            }

            // 🔥 ИСПРАВЛЕНО: Конвертируем только что созданные рекомендации в плоские CourseResponse DTO
            return mapToCourseResponse(savedRecommendations);

        } catch (Exception e) {
            log.error("Ошибка при работе с нейросетью или парсинге JSON: {}", e.getMessage());
            throw new RuntimeException("Ошибка при генерации AI-рекомендаций: " + e.getMessage(), e);
        }
    }

    // 🔥 ДОБАВЛЕНО: Удобный приватный метод-маппер для преобразования UserCourse -> CourseResponse
    private List<CourseResponse> mapToCourseResponse(List<UserCourse> userCourses) {
        return userCourses.stream().map(uc -> {
            Course c = uc.getCourse();
            return CourseResponse.builder()
                    .id(c.getId())
                    .title(c.getTitle())
                    .description(c.getDescription())
                    .price(c.getPrice())
                    .format(c.getFormat())
                    .durationWeeks(c.getDurationWeeks()) // ⚡ Передаем недели (убираем баг с 0 недель)
                    .url(c.getUrl())
                    .matchPercent(uc.getMatchPercent())
                    .aiAnalysis(uc.getAiAnalysis())
                    .build();
        }).collect(Collectors.toList());
    }

    private String formatCoursesForAi(List<Course> courses) {
        StringBuilder sb = new StringBuilder();
        for (Course c : courses) {
            // Включаем duration_weeks в информацию для ИИ, чтобы он тоже понимал длительность
            sb.append(String.format("ID: %s, Название: \"%s\", Описание: \"%s\", Цена: %s, Формат: %s, Длительность: %s недель\n",
                    c.getId(), c.getTitle(), c.getDescription(), c.getPrice(), c.getFormat(), c.getDurationWeeks()));
        }
        return sb.toString();
    }
}
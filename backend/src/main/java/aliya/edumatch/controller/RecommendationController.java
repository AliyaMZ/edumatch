package aliya.edumatch.controller;

import aliya.edumatch.dto.CourseResponse;
import aliya.edumatch.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class RecommendationController {

    private final RecommendationService recommendationService;

    /**
     * Получить или сгенерировать персональные AI-рекомендации курсов для пользователя.
     * Эндпоинт: GET /api/users/{userId}/recommendations
     */
    @GetMapping("/{userId}/recommendations")
    public ResponseEntity<?> getAiRecommendations(@PathVariable Long userId) {
        try {
            log.info("Получен запрос на AI-рекомендации для пользователя с ID: {}", userId);

            List<CourseResponse> response = recommendationService.getOrCreateRecommendations(userId);


            if (response == null || response.isEmpty()) {
                log.warn(" СЕРВИС ВЕРНУЛ ПУСТОЙ СПИСОК для пользователя {}", userId);
            } else {
                log.info("Успешно отправлено {} рекомендаций для пользователя {}", response.size(), userId);
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Ошибка при формировании рекомендаций для пользователя {}: ", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Не удалось собрать рекомендации: " + e.getMessage()));
        }
    }
}
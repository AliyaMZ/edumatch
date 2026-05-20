package aliya.edumatch.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseResponse {
    private Long id;
    private String title;
    private String description;
    private String price;
    private String format;
    private Integer durationWeeks; // 🔥 Исправлено под вашу сущность
    private String url;

    // Поля для персональной интеграции с ИИ (из user_courses)
    private Integer matchPercent;
    private String aiAnalysis;
}
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
    private Integer durationWeeks;
    private String url;

    private Integer matchPercent;
    private String aiAnalysis;
}
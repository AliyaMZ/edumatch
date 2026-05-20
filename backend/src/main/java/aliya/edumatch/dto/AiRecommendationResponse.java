package aliya.edumatch.dto;

import lombok.Data;

@Data
public class AiRecommendationResponse {
    private Long courseId;
    private Integer matchPercent;
    private String aiAnalysis;
}
package aliya.edumatch.dto;

import java.util.List;

@lombok.Data
public class AiWrapperResponse {
    private List<AiRecommendationResponse> recommendations;
}
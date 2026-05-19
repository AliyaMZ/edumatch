package aliya.edumatch.dto;

import lombok.Data;

@Data
public class UserUpdateDTO {
    private String username;
    private String goal;
    private String level;
    private Integer hoursPerWeek;
    private Double budget;
}
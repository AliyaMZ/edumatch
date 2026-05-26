package aliya.edumatch.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String price;

    @Column(name = "ai_analysis", columnDefinition = "TEXT")
    private String aiAnalysis;

    private String url;

    @Column(name = "duration_weeks")
    private Integer durationWeeks;

    private String format;
}
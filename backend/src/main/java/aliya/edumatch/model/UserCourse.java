package aliya.edumatch.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCourse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // LAZY лучше для производительности
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @Builder.Default // Чтобы Lombok Builder тоже видел дефолтное значение
    private int progress = 0;

    @Builder.Default
    private String status = "not_started";

    // Автоматическая установка статуса перед сохранением, если он пустой
    @PrePersist
    protected void onCreate() {
        if (this.status == null) {
            this.status = "not_started";
        }
    }
}
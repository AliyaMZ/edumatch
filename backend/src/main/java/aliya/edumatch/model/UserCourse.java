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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @Builder.Default
    private int progress = 0;

    @Builder.Default
    private String status = "not_started"; // Возможные варианты теперь: not_started, in_progress, completed, recommended

    // 🏆 НОВЫЕ ПОЛЯ ДЛЯ AI-ПОДБОРА:

    @Builder.Default
    private Integer matchPercent = 0; // Процент соответствия курса профилю пользователя (0-100)

    @Column(columnDefinition = "TEXT") // TEXT в БД, чтобы поместилось длинное обоснование от нейросети
    private String aiAnalysis; // Персональный вердикт ИИ, почему курс подходит

    @PrePersist
    protected void onCreate() {
        if (this.status == null) {
            this.status = "not_started";
        }
        // Защита для нового поля matchPercent
        if (this.matchPercent == null) {
            this.matchPercent = 0;
        }
    }
}
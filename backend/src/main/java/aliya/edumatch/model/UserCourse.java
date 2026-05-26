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
    private String status = "not_started";



    @Builder.Default
    private Integer matchPercent = 0;

    @Column(columnDefinition = "TEXT")
    private String aiAnalysis;

    @PrePersist
    protected void onCreate() {
        if (this.status == null) {
            this.status = "not_started";
        }

        if (this.matchPercent == null) {
            this.matchPercent = 0;
        }
    }
}
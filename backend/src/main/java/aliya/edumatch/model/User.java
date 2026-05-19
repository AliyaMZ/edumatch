package aliya.edumatch.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Set;
import java.util.List;
import java.util.ArrayList;
import java.util.HashSet;

@Entity
@Table(name = "users")
@Data
// Эта аннотация предотвращает ошибки при ленивой загрузке Hibernate
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password", nullable = false, updatable = false)
    @JsonIgnore // Пароль никогда не должен уходить на фронтенд
    private String password;

    @Column(nullable = false)
    private String role = "USER";

    // --- ПОЛЯ ДЛЯ ПРОФИЛЯ ОБУЧЕНИЯ ---

    @Column(columnDefinition = "TEXT")
    private String goal;

    private String level;

    private Integer hoursPerWeek;

    private Double budget;

    @ElementCollection
    @CollectionTable(name = "user_formats", joinColumns = @JoinColumn(name = "user_id"))
    private List<String> preferredFormats = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "user_interests", joinColumns = @JoinColumn(name = "user_id"))
    private List<String> interests = new ArrayList<>();

    // --- ИЗБРАННЫЕ КУРСЫ ---
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "user_favorites",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    @JsonIgnore // Чтобы избежать циклической ссылки при получении пользователя
    private Set<Course> favoriteCourses = new HashSet<>();

    // --- ПРОГРЕСС ПО КУРСАМ ---
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore // Обязательно исключаем, чтобы Jackson не зациклился на этой связи
    private List<UserCourse> courseProgress = new ArrayList<>();
}
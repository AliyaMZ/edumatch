package aliya.edumatch.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Set;
import java.util.List;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    // Роль: "USER" или "ADMIN"
    @Column(nullable = false)
    private String role = "USER";

    // --- ПОЛЯ ДЛЯ ПРОФИЛЯ ОБУЧЕНИЯ ---

    @Column(columnDefinition = "TEXT")
    private String goal; // Цель обучения

    private String level; // beginner, intermediate, advanced

    private Integer hoursPerWeek; // Кол-во часов

    private Double budget; // Бюджет (₽)

    // Список форматов (видео, текст и т.д.)
    @ElementCollection
    @CollectionTable(name = "user_formats", joinColumns = @JoinColumn(name = "user_id"))
    private List<String> preferredFormats;

    // Список интересов (Python, ML и т.д.)
    @ElementCollection
    @CollectionTable(name = "user_interests", joinColumns = @JoinColumn(name = "user_id"))
    private List<String> interests;

    // --- ИЗБРАННЫЕ КУРСЫ ---
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "user_favorites",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> favoriteCourses = new java.util.HashSet<>();

    // --- ПРОГРЕСС ПО КУРСАМ ---
    // Добавь это поле, чтобы связать пользователя с его записями прогресса
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserCourse> courseProgress = new java.util.ArrayList<>();
}
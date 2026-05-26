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

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password", nullable = false, updatable = false)
    @JsonIgnore
    private String password;

    @Column(nullable = false)
    private String role = "USER";



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


    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "user_favorites",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    @JsonIgnore
    private Set<Course> favoriteCourses = new HashSet<>();


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<UserCourse> courseProgress = new ArrayList<>();
}
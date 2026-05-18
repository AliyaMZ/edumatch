package aliya.edumatch.repository;

import aliya.edumatch.model.UserCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserCourseRepository extends JpaRepository<UserCourse, Long> {
    List<UserCourse> findByUserId(Long userId);
    Optional<UserCourse> findByUserIdAndCourseId(Long userId, Long courseId);
}
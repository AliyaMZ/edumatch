package aliya.edumatch.repository;

import aliya.edumatch.model.UserCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UserCourseRepository extends JpaRepository<UserCourse, Long> {
    List<UserCourse> findByUserId(Long userId);

    Optional<UserCourse> findByUserIdAndCourseId(Long userId, Long courseId);

    List<UserCourse> findByUserIdAndStatus(Long userId, String status);

    // 🔥 ДОБАВЛЕНО: Аннотации для корректного удаления
    @Modifying
    @Query("DELETE FROM UserCourse uc WHERE uc.user.id = :userId AND uc.status = :status")
    void deleteByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);

    @Query("SELECT uc FROM UserCourse uc WHERE uc.user.id = :userId AND uc.course.id = :courseId")
    List<UserCourse> findByUserIdAndCourseIdList(@Param("userId") Long userId, @Param("courseId") Long courseId);
}
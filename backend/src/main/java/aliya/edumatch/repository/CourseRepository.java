package aliya.edumatch.repository;

import aliya.edumatch.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    // Здесь пока ничего не нужно писать.
    // Все базовые методы (сохранить, удалить, найти) уже добавлены через JpaRepository.
}
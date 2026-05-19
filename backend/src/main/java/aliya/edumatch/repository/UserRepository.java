package aliya.edumatch.repository;

import aliya.edumatch.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 1. Для логина: найти пользователя по email
    Optional<User> findByEmail(String email);

    // 2. Для регистрации: проверить, свободен ли email 🔥 НОВОЕ
    boolean existsByEmail(String email);
}
package aliya.edumatch.repository;

import aliya.edumatch.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Этот метод поможет нам находить пользователя по почте при логине
    Optional<User> findByEmail(String email);
}
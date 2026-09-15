package ch.sectioninformatique.template.log;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;

@SuppressWarnings("null")
public interface LogRepository extends CrudRepository<Log, Long> {

    @Query("SELECT l FROM Log l")
    List<Log> findAllIncludingDeleted();

    boolean existsById(Long id);

    @Modifying
    @Transactional
    @Query("DELETE FROM Log l WHERE l.id = :id")
    void deleteById(Long id);

    @Query("SELECT l FROM Log l WHERE l.user.email = :email")
    List<Log> findByUserEmail(@Param("email") String email);

}
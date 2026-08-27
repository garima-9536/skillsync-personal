package com.skillsync.repository;

import com.skillsync.entity.Users;
import com.skillsync.enums.AvailabilityStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Users> findAllByActiveTrue();

    @Query("SELECT u FROM Users u WHERE u.active = true " +
           "AND (:location IS NULL OR LOWER(u.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:availability IS NULL OR u.availabilityStatus = :availability)")
    Page<Users> searchUsers(@Param("location") String location,
                            @Param("availability") AvailabilityStatus availability,
                            Pageable pageable);
}

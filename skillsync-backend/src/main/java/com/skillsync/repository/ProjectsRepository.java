package com.skillsync.repository;

import com.skillsync.entity.Projects;
import com.skillsync.enums.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectsRepository extends JpaRepository<Projects, Long> {
    List<Projects> findByOwnerId(Long ownerId);

    @Query("SELECT p FROM Projects p WHERE " +
           "(:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "   OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:status IS NULL OR p.status = :status)")
    Page<Projects> searchProjects(@Param("search") String search,
                                  @Param("status") ProjectStatus status,
                                  Pageable pageable);
}

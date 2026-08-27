package com.skillsync.repository;

import com.skillsync.entity.Skills;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillsRepository extends JpaRepository<Skills, Long> {
    List<Skills> findByCategory(String category);
    boolean existsByName(String name);
    List<Skills> findByNameContainingIgnoreCase(String name);
    List<Skills> findByOrderByCategory();
}

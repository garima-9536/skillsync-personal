package com.skillsync.repository;

import com.skillsync.entity.UserSkills;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSkillsRepository extends JpaRepository<UserSkills, Long> {
    List<UserSkills> findByUserId(Long userId);
    Optional<UserSkills> findByUserIdAndSkillId(Long userId, Long skillId);
    boolean existsByUserIdAndSkillId(Long userId, Long skillId);
    List<UserSkills> findBySkillIdIn(List<Long> skillIds);
    List<UserSkills> findByUserIdIn(List<Long> userIds);
}

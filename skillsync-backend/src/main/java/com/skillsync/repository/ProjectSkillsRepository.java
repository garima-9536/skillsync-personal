package com.skillsync.repository;

import com.skillsync.entity.ProjectSkills;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectSkillsRepository extends JpaRepository<ProjectSkills, Long> {
    List<ProjectSkills> findByProjectId(Long projectId);
    void deleteByProjectId(Long projectId);
    List<ProjectSkills> findBySkillIdIn(List<Long> skillIds);
}

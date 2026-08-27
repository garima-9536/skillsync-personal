package com.skillsync.repository;

import com.skillsync.entity.ProjectMembers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectMembersRepository extends JpaRepository<ProjectMembers, Long> {
    List<ProjectMembers> findByProjectId(Long projectId);
    List<ProjectMembers> findByUserId(Long userId);
    boolean existsByProjectIdAndUserId(Long projectId, Long userId);
    long countByProjectId(Long projectId);
    void deleteByProjectIdAndUserId(Long projectId, Long userId);
}

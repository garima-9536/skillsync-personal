package com.skillsync.service;

import com.skillsync.dto.*;
import com.skillsync.utility.SkillSyncException;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProjectsService {
    PageResponseDTO<ProjectSummaryDTO> getProjects(String search, Long skillId, String status, Pageable pageable);
    ProjectDTO getProjectById(Long projectId) throws SkillSyncException;
    ProjectDTO createProject(Long ownerId, CreateProjectDTO dto) throws SkillSyncException;
    ProjectDTO updateProject(Long projectId, Long ownerId, UpdateProjectDTO dto) throws SkillSyncException;
    void deleteProject(Long projectId, Long ownerId) throws SkillSyncException;
    List<ProjectSummaryDTO> getMyProjects(Long ownerId);
    void removeMember(Long projectId, Long ownerId, Long userId) throws SkillSyncException;
}

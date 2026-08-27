package com.skillsync.service;

import com.skillsync.dto.*;
import com.skillsync.entity.*;
import com.skillsync.enums.MemberRole;
import com.skillsync.enums.ProjectStatus;
import com.skillsync.repository.*;
import com.skillsync.utility.SkillSyncException;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service(value = "projectsService")
@Transactional
public class ProjectsServiceImpl implements ProjectsService {

    private final ProjectsRepository projectsRepository;
    private final ProjectSkillsRepository projectSkillsRepository;
    private final ProjectMembersRepository projectMembersRepository;
    private final SkillsRepository skillsRepository;
    private final UsersRepository usersRepository;

    public ProjectsServiceImpl(ProjectsRepository projectsRepository,
                               ProjectSkillsRepository projectSkillsRepository,
                               ProjectMembersRepository projectMembersRepository,
                               SkillsRepository skillsRepository,
                               UsersRepository usersRepository) {
        this.projectsRepository = projectsRepository;
        this.projectSkillsRepository = projectSkillsRepository;
        this.projectMembersRepository = projectMembersRepository;
        this.skillsRepository = skillsRepository;
        this.usersRepository = usersRepository;
    }

    @Override
    public PageResponseDTO<ProjectSummaryDTO> getProjects(String search, Long skillId, String status, Pageable pageable) {
        ProjectStatus projectStatus = null;
        if (status != null && !status.isBlank()) {
            try { projectStatus = ProjectStatus.valueOf(status.toUpperCase()); } catch (Exception ignored) {}
        }

        Page<Projects> page = projectsRepository.searchProjects(search, projectStatus, pageable);
        List<Projects> projects = page.getContent();

        if (skillId != null) {
            List<Long> projectIdsWithSkill = projectSkillsRepository.findBySkillIdIn(List.of(skillId))
                    .stream().map(ProjectSkills::getProjectId).distinct().toList();
            projects = projects.stream()
                    .filter(p -> projectIdsWithSkill.contains(p.getProjectId()))
                    .toList();
        }

        List<ProjectSummaryDTO> content = projects.stream()
                .map(this::toSummaryDTO).toList();

        return PageResponseDTO.<ProjectSummaryDTO>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Override
    public ProjectDTO getProjectById(Long projectId) throws SkillSyncException {
        Projects project = projectsRepository.findById(projectId)
                .orElseThrow(() -> new SkillSyncException("Service.PROJECT_NOT_FOUND"));
        return toFullDTO(project);
    }

    @Override
    public ProjectDTO createProject(Long ownerId, CreateProjectDTO dto) throws SkillSyncException {
        usersRepository.findById(ownerId).orElseThrow(() -> new SkillSyncException("Service.USER_NOT_FOUND"));

        Projects project = Projects.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .maxTeamSize(dto.getMaxTeamSize() != null ? dto.getMaxTeamSize() : 5)
                .ownerId(ownerId)
                .build();
        project = projectsRepository.save(project);

        // Save required skills
        if (dto.getRequiredSkillIds() != null) {
            for (Long skillId : dto.getRequiredSkillIds()) {
                ProjectSkills ps = ProjectSkills.builder()
                        .projectId(project.getProjectId())
                        .skillId(skillId)
                        .required(true)
                        .build();
                projectSkillsRepository.save(ps);
            }
        }

        // Add owner as OWNER member
        ProjectMembers ownerMember = ProjectMembers.builder()
                .projectId(project.getProjectId())
                .userId(ownerId)
                .role(MemberRole.OWNER)
                .build();
        projectMembersRepository.save(ownerMember);

        return toFullDTO(project);
    }

    @Override
    public ProjectDTO updateProject(Long projectId, Long ownerId, UpdateProjectDTO dto) throws SkillSyncException {
        Projects project = projectsRepository.findById(projectId)
                .orElseThrow(() -> new SkillSyncException("Service.PROJECT_NOT_FOUND"));
        if (!project.getOwnerId().equals(ownerId)) {
            throw new SkillSyncException("Service.UNAUTHORIZED_ACTION");
        }
        if (dto.getTitle() != null) project.setTitle(dto.getTitle());
        if (dto.getDescription() != null) project.setDescription(dto.getDescription());
        if (dto.getStatus() != null) project.setStatus(dto.getStatus());
        if (dto.getMaxTeamSize() != null) project.setMaxTeamSize(dto.getMaxTeamSize());
        project = projectsRepository.save(project);

        if (dto.getRequiredSkillIds() != null) {
            projectSkillsRepository.deleteByProjectId(projectId);
            for (Long skillId : dto.getRequiredSkillIds()) {
                projectSkillsRepository.save(ProjectSkills.builder()
                        .projectId(projectId).skillId(skillId).required(true).build());
            }
        }
        return toFullDTO(project);
    }

    @Override
    public void deleteProject(Long projectId, Long ownerId) throws SkillSyncException {
        Projects project = projectsRepository.findById(projectId)
                .orElseThrow(() -> new SkillSyncException("Service.PROJECT_NOT_FOUND"));
        if (!project.getOwnerId().equals(ownerId)) {
            throw new SkillSyncException("Service.UNAUTHORIZED_ACTION");
        }
        projectSkillsRepository.deleteByProjectId(projectId);
        projectsRepository.delete(project);
    }

    @Override
    public List<ProjectSummaryDTO> getMyProjects(Long ownerId) {
        return projectsRepository.findByOwnerId(ownerId).stream()
                .map(this::toSummaryDTO).toList();
    }

    @Override
    public void removeMember(Long projectId, Long ownerId, Long userId) throws SkillSyncException {
        Projects project = projectsRepository.findById(projectId)
                .orElseThrow(() -> new SkillSyncException("Service.PROJECT_NOT_FOUND"));
        if (!project.getOwnerId().equals(ownerId)) {
            throw new SkillSyncException("Service.UNAUTHORIZED_ACTION");
        }
        projectMembersRepository.deleteByProjectIdAndUserId(projectId, userId);
    }

    private ProjectSummaryDTO toSummaryDTO(Projects project) {
        String ownerName = usersRepository.findById(project.getOwnerId())
                .map(Users::getFullName).orElse("Unknown");
        long memberCount = projectMembersRepository.countByProjectId(project.getProjectId());
        List<SkillDTO> skills = getProjectSkillDTOs(project.getProjectId());
        return ProjectSummaryDTO.builder()
                .projectId(project.getProjectId())
                .title(project.getTitle())
                .description(project.getDescription())
                .status(project.getStatus())
                .ownerId(project.getOwnerId())
                .ownerName(ownerName)
                .maxTeamSize(project.getMaxTeamSize())
                .memberCount((int) memberCount)
                .createdAt(project.getCreatedAt())
                .requiredSkills(skills)
                .build();
    }

    private ProjectDTO toFullDTO(Projects project) {
        String ownerName = usersRepository.findById(project.getOwnerId())
                .map(Users::getFullName).orElse("Unknown");
        long memberCount = projectMembersRepository.countByProjectId(project.getProjectId());
        List<SkillDTO> skills = getProjectSkillDTOs(project.getProjectId());
        List<ProjectMemberDTO> members = getProjectMemberDTOs(project.getProjectId());

        ProjectDTO dto = new ProjectDTO();
        BeanUtils.copyProperties(project, dto);
        dto.setOwnerName(ownerName);
        dto.setMemberCount((int) memberCount);
        dto.setRequiredSkills(skills);
        dto.setMembers(members);
        return dto;
    }

    private List<SkillDTO> getProjectSkillDTOs(Long projectId) {
        List<ProjectSkills> projectSkills = projectSkillsRepository.findByProjectId(projectId);
        if (projectSkills.isEmpty()) return new ArrayList<>();
        List<Long> skillIds = projectSkills.stream().map(ProjectSkills::getSkillId).toList();
        Map<Long, Skills> skillMap = skillsRepository.findAllById(skillIds)
                .stream().collect(Collectors.toMap(Skills::getSkillId, s -> s));
        return projectSkills.stream().map(ps -> {
            Skills skill = skillMap.get(ps.getSkillId());
            return SkillDTO.builder()
                    .skillId(ps.getSkillId())
                    .name(skill != null ? skill.getName() : "")
                    .category(skill != null ? skill.getCategory() : "")
                    .description(skill != null ? skill.getDescription() : "")
                    .build();
        }).toList();
    }

    private List<ProjectMemberDTO> getProjectMemberDTOs(Long projectId) {
        return projectMembersRepository.findByProjectId(projectId).stream().map(pm -> {
            String name = usersRepository.findById(pm.getUserId()).map(Users::getFullName).orElse("");
            String email = usersRepository.findById(pm.getUserId()).map(Users::getEmail).orElse("");
            return ProjectMemberDTO.builder()
                    .userId(pm.getUserId())
                    .fullName(name)
                    .email(email)
                    .role(pm.getRole())
                    .joinedAt(pm.getJoinedAt())
                    .build();
        }).toList();
    }
}

package com.skillsync.service;

import com.skillsync.dto.ApplicationDTO;
import com.skillsync.dto.CreateApplicationDTO;
import com.skillsync.entity.ProjectApplications;
import com.skillsync.entity.ProjectMembers;
import com.skillsync.entity.Projects;
import com.skillsync.enums.MemberRole;
import com.skillsync.enums.RequestStatus;
import com.skillsync.repository.*;
import com.skillsync.utility.SkillSyncException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service(value = "applicationService")
@Transactional
public class ApplicationServiceImpl implements ApplicationService {

    private final ProjectApplicationsRepository applicationRepo;
    private final ProjectsRepository projectsRepo;
    private final ProjectMembersRepository membersRepo;
    private final UsersRepository usersRepo;

    public ApplicationServiceImpl(ProjectApplicationsRepository applicationRepo,
                                  ProjectsRepository projectsRepo,
                                  ProjectMembersRepository membersRepo,
                                  UsersRepository usersRepo) {
        this.applicationRepo = applicationRepo;
        this.projectsRepo = projectsRepo;
        this.membersRepo = membersRepo;
        this.usersRepo = usersRepo;
    }

    @Override
    public ApplicationDTO applyToProject(Long applicantId, CreateApplicationDTO dto) throws SkillSyncException {
        Projects project = projectsRepo.findById(dto.getProjectId())
                .orElseThrow(() -> new SkillSyncException("Service.PROJECT_NOT_FOUND"));
        if (project.getOwnerId().equals(applicantId)) {
            throw new SkillSyncException("Service.CANNOT_APPLY_OWN_PROJECT");
        }
        if (membersRepo.existsByProjectIdAndUserId(dto.getProjectId(), applicantId)) {
            throw new SkillSyncException("Service.REQUEST_ALREADY_MEMBER");
        }
        if (applicationRepo.existsByProjectIdAndApplicantId(dto.getProjectId(), applicantId)) {
            throw new SkillSyncException("Service.APPLICATION_ALREADY_SENT");
        }
        long currentMembers = membersRepo.countByProjectId(dto.getProjectId());
        if (currentMembers >= project.getMaxTeamSize()) {
            throw new SkillSyncException("Service.PROJECT_FULL");
        }
        ProjectApplications application = ProjectApplications.builder()
                .projectId(dto.getProjectId())
                .applicantId(applicantId)
                .message(dto.getMessage())
                .build();
        application = applicationRepo.save(application);
        return toDTO(application);
    }

    @Override
    public List<ApplicationDTO> getApplicationsForProject(Long projectId, Long ownerId) throws SkillSyncException {
        Projects project = projectsRepo.findById(projectId)
                .orElseThrow(() -> new SkillSyncException("Service.PROJECT_NOT_FOUND"));
        if (!project.getOwnerId().equals(ownerId)) {
            throw new SkillSyncException("Service.UNAUTHORIZED_ACTION");
        }
        return applicationRepo.findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream().map(this::toDTO).toList();
    }

    @Override
    public List<ApplicationDTO> getMyApplications(Long applicantId) {
        return applicationRepo.findByApplicantIdOrderByCreatedAtDesc(applicantId)
                .stream().map(this::toDTO).toList();
    }

    @Override
    public void acceptApplication(Long applicationId, Long ownerId) throws SkillSyncException {
        ProjectApplications application = applicationRepo.findById(applicationId)
                .orElseThrow(() -> new SkillSyncException("Service.APPLICATION_NOT_FOUND"));
        Projects project = projectsRepo.findById(application.getProjectId())
                .orElseThrow(() -> new SkillSyncException("Service.PROJECT_NOT_FOUND"));
        if (!project.getOwnerId().equals(ownerId)) {
            throw new SkillSyncException("Service.UNAUTHORIZED_ACTION");
        }
        application.setStatus(RequestStatus.ACCEPTED);
        applicationRepo.save(application);
        if (!membersRepo.existsByProjectIdAndUserId(application.getProjectId(), application.getApplicantId())) {
            membersRepo.save(ProjectMembers.builder()
                    .projectId(application.getProjectId())
                    .userId(application.getApplicantId())
                    .role(MemberRole.MEMBER)
                    .build());
        }
    }

    @Override
    public void rejectApplication(Long applicationId, Long ownerId) throws SkillSyncException {
        ProjectApplications application = applicationRepo.findById(applicationId)
                .orElseThrow(() -> new SkillSyncException("Service.APPLICATION_NOT_FOUND"));
        Projects project = projectsRepo.findById(application.getProjectId())
                .orElseThrow(() -> new SkillSyncException("Service.PROJECT_NOT_FOUND"));
        if (!project.getOwnerId().equals(ownerId)) {
            throw new SkillSyncException("Service.UNAUTHORIZED_ACTION");
        }
        application.setStatus(RequestStatus.REJECTED);
        applicationRepo.save(application);
    }

    private ApplicationDTO toDTO(ProjectApplications a) {
        String applicantName = usersRepo.findById(a.getApplicantId()).map(u -> u.getFullName()).orElse("");
        String projectTitle = projectsRepo.findById(a.getProjectId()).map(p -> p.getTitle()).orElse("");
        return ApplicationDTO.builder()
                .applicationId(a.getApplicationId())
                .projectId(a.getProjectId())
                .projectTitle(projectTitle)
                .applicantId(a.getApplicantId())
                .applicantName(applicantName)
                .message(a.getMessage())
                .status(a.getStatus())
                .createdAt(a.getCreatedAt())
                .build();
    }
}

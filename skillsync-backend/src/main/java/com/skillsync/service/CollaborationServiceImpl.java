package com.skillsync.service;

import com.skillsync.dto.CollaborationRequestDTO;
import com.skillsync.dto.CreateCollaborationRequestDTO;
import com.skillsync.entity.CollaborationRequests;
import com.skillsync.entity.ProjectMembers;
import com.skillsync.entity.Projects;
import com.skillsync.enums.MemberRole;
import com.skillsync.enums.RequestStatus;
import com.skillsync.repository.*;
import com.skillsync.utility.SkillSyncException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service(value = "collaborationService")
@Transactional
public class CollaborationServiceImpl implements CollaborationService {

    private final CollaborationRequestsRepository collaborationRepo;
    private final ProjectsRepository projectsRepo;
    private final ProjectMembersRepository membersRepo;
    private final UsersRepository usersRepo;

    public CollaborationServiceImpl(CollaborationRequestsRepository collaborationRepo,
                                    ProjectsRepository projectsRepo,
                                    ProjectMembersRepository membersRepo,
                                    UsersRepository usersRepo) {
        this.collaborationRepo = collaborationRepo;
        this.projectsRepo = projectsRepo;
        this.membersRepo = membersRepo;
        this.usersRepo = usersRepo;
    }

    @Override
    public CollaborationRequestDTO sendRequest(Long senderId, CreateCollaborationRequestDTO dto) throws SkillSyncException {
        Projects project = projectsRepo.findById(dto.getProjectId())
                .orElseThrow(() -> new SkillSyncException("Service.PROJECT_NOT_FOUND"));
        if (membersRepo.existsByProjectIdAndUserId(dto.getProjectId(), dto.getReceiverId())) {
            throw new SkillSyncException("Service.REQUEST_ALREADY_MEMBER");
        }
        if (collaborationRepo.existsByProjectIdAndSenderIdAndStatus(dto.getProjectId(), senderId, RequestStatus.PENDING)) {
            throw new SkillSyncException("Service.REQUEST_ALREADY_SENT");
        }
        long currentMembers = membersRepo.countByProjectId(dto.getProjectId());
        if (currentMembers >= project.getMaxTeamSize()) {
            throw new SkillSyncException("Service.PROJECT_FULL");
        }
        CollaborationRequests request = CollaborationRequests.builder()
                .projectId(dto.getProjectId())
                .senderId(senderId)
                .receiverId(dto.getReceiverId())
                .message(dto.getMessage())
                .build();
        request = collaborationRepo.save(request);
        return toDTO(request);
    }

    @Override
    public List<CollaborationRequestDTO> getReceivedRequests(Long userId) {
        return collaborationRepo.findByReceiverIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toDTO).toList();
    }

    @Override
    public List<CollaborationRequestDTO> getSentRequests(Long userId) {
        return collaborationRepo.findBySenderIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toDTO).toList();
    }

    @Override
    public void acceptRequest(Long requestId, Long userId) throws SkillSyncException {
        CollaborationRequests request = collaborationRepo.findById(requestId)
                .orElseThrow(() -> new SkillSyncException("Service.REQUEST_NOT_FOUND"));
        if (!request.getReceiverId().equals(userId)) {
            throw new SkillSyncException("Service.UNAUTHORIZED_ACTION");
        }
        request.setStatus(RequestStatus.ACCEPTED);
        collaborationRepo.save(request);
        if (!membersRepo.existsByProjectIdAndUserId(request.getProjectId(), userId)) {
            membersRepo.save(ProjectMembers.builder()
                    .projectId(request.getProjectId())
                    .userId(userId)
                    .role(MemberRole.MEMBER)
                    .build());
        }
    }

    @Override
    public void rejectRequest(Long requestId, Long userId) throws SkillSyncException {
        CollaborationRequests request = collaborationRepo.findById(requestId)
                .orElseThrow(() -> new SkillSyncException("Service.REQUEST_NOT_FOUND"));
        if (!request.getReceiverId().equals(userId)) {
            throw new SkillSyncException("Service.UNAUTHORIZED_ACTION");
        }
        request.setStatus(RequestStatus.REJECTED);
        collaborationRepo.save(request);
    }

    private CollaborationRequestDTO toDTO(CollaborationRequests r) {
        String senderName = usersRepo.findById(r.getSenderId()).map(u -> u.getFullName()).orElse("");
        String receiverName = usersRepo.findById(r.getReceiverId()).map(u -> u.getFullName()).orElse("");
        String projectTitle = projectsRepo.findById(r.getProjectId()).map(p -> p.getTitle()).orElse("");
        return CollaborationRequestDTO.builder()
                .requestId(r.getRequestId())
                .projectId(r.getProjectId())
                .projectTitle(projectTitle)
                .senderId(r.getSenderId())
                .senderName(senderName)
                .receiverId(r.getReceiverId())
                .receiverName(receiverName)
                .message(r.getMessage())
                .status(r.getStatus())
                .createdAt(r.getCreatedAt())
                .build();
    }
}

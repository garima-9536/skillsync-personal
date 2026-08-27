package com.skillsync.service;

import com.skillsync.dto.CollaborationRequestDTO;
import com.skillsync.dto.CreateCollaborationRequestDTO;
import com.skillsync.utility.SkillSyncException;

import java.util.List;

public interface CollaborationService {
    CollaborationRequestDTO sendRequest(Long senderId, CreateCollaborationRequestDTO dto) throws SkillSyncException;
    List<CollaborationRequestDTO> getReceivedRequests(Long userId);
    List<CollaborationRequestDTO> getSentRequests(Long userId);
    void acceptRequest(Long requestId, Long userId) throws SkillSyncException;
    void rejectRequest(Long requestId, Long userId) throws SkillSyncException;
}

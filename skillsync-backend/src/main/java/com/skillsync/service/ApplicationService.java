package com.skillsync.service;

import com.skillsync.dto.ApplicationDTO;
import com.skillsync.dto.CreateApplicationDTO;
import com.skillsync.utility.SkillSyncException;

import java.util.List;

public interface ApplicationService {
    ApplicationDTO applyToProject(Long applicantId, CreateApplicationDTO dto) throws SkillSyncException;
    List<ApplicationDTO> getApplicationsForProject(Long projectId, Long ownerId) throws SkillSyncException;
    List<ApplicationDTO> getMyApplications(Long applicantId);
    void acceptApplication(Long applicationId, Long ownerId) throws SkillSyncException;
    void rejectApplication(Long applicationId, Long ownerId) throws SkillSyncException;
}

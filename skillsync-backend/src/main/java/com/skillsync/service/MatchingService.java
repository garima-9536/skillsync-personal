package com.skillsync.service;

import com.skillsync.dto.MatchedProjectDTO;
import com.skillsync.dto.MatchedUserDTO;
import com.skillsync.utility.SkillSyncException;

import java.util.List;

public interface MatchingService {
    List<MatchedUserDTO> findMatchesForProject(Long projectId) throws SkillSyncException;
    List<MatchedProjectDTO> findMatchingProjects(Long userId) throws SkillSyncException;
}

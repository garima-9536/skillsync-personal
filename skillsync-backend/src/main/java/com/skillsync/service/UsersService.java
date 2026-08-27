package com.skillsync.service;

import com.skillsync.dto.*;
import com.skillsync.utility.SkillSyncException;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UsersService {
    UserDTO getUserById(Long userId) throws SkillSyncException;
    UserDTO updateUser(Long userId, UpdateUserDTO dto) throws SkillSyncException;
    PageResponseDTO<UserSummaryDTO> searchUsers(List<Long> skillIds, String location, String availability, Pageable pageable);
    UserSkillDTO addUserSkill(Long userId, AddUserSkillDTO dto) throws SkillSyncException;
    UserSkillDTO updateUserSkill(Long userId, Long userSkillId, AddUserSkillDTO dto) throws SkillSyncException;
    void removeUserSkill(Long userId, Long userSkillId) throws SkillSyncException;
}

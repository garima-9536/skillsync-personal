package com.skillsync.service;

import com.skillsync.dto.AuthResponseDTO;
import com.skillsync.dto.LoginRequestDTO;
import com.skillsync.dto.RegisterRequestDTO;
import com.skillsync.utility.SkillSyncException;

public interface AuthService {
    AuthResponseDTO register(RegisterRequestDTO dto) throws SkillSyncException;
    AuthResponseDTO login(LoginRequestDTO dto) throws SkillSyncException;
}

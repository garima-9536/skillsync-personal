package com.skillsync.service;

import com.skillsync.dto.SkillDTO;
import com.skillsync.utility.SkillSyncException;

import java.util.List;

public interface SkillsService {
    List<SkillDTO> getAllSkills(String category);
    SkillDTO createSkill(SkillDTO dto) throws SkillSyncException;
}

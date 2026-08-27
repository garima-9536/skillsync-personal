package com.skillsync.service;

import com.skillsync.dto.SkillDTO;
import com.skillsync.entity.Skills;
import com.skillsync.repository.SkillsRepository;
import com.skillsync.utility.SkillSyncException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service(value = "skillsService")
@Transactional
public class SkillsServiceImpl implements SkillsService {

    private final SkillsRepository skillsRepository;

    public SkillsServiceImpl(SkillsRepository skillsRepository) {
        this.skillsRepository = skillsRepository;
    }

    @Override
    public List<SkillDTO> getAllSkills(String category) {
        List<Skills> skills = (category != null && !category.isBlank())
                ? skillsRepository.findByCategory(category)
                : skillsRepository.findByOrderByCategory();
        return skills.stream().map(this::toDTO).toList();
    }

    @Override
    public SkillDTO createSkill(SkillDTO dto) throws SkillSyncException {
        if (skillsRepository.existsByName(dto.getName())) {
            throw new SkillSyncException("Service.SKILL_NAME_ALREADY_EXISTS");
        }
        Skills skill = new Skills();
        BeanUtils.copyProperties(dto, skill);
        skill = skillsRepository.save(skill);
        return toDTO(skill);
    }

    private SkillDTO toDTO(Skills skill) {
        SkillDTO dto = new SkillDTO();
        BeanUtils.copyProperties(skill, dto);
        return dto;
    }
}

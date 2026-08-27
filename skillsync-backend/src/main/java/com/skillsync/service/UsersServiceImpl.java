package com.skillsync.service;

import com.skillsync.dto.*;
import com.skillsync.entity.Skills;
import com.skillsync.entity.UserSkills;
import com.skillsync.entity.Users;
import com.skillsync.enums.AvailabilityStatus;
import com.skillsync.repository.SkillsRepository;
import com.skillsync.repository.UserSkillsRepository;
import com.skillsync.repository.UsersRepository;
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

@Service(value = "usersService")
@Transactional
public class UsersServiceImpl implements UsersService {

    private final UsersRepository usersRepository;
    private final UserSkillsRepository userSkillsRepository;
    private final SkillsRepository skillsRepository;

    public UsersServiceImpl(UsersRepository usersRepository,
                            UserSkillsRepository userSkillsRepository,
                            SkillsRepository skillsRepository) {
        this.usersRepository = usersRepository;
        this.userSkillsRepository = userSkillsRepository;
        this.skillsRepository = skillsRepository;
    }

    @Override
    public UserDTO getUserById(Long userId) throws SkillSyncException {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new SkillSyncException("Service.USER_NOT_FOUND"));
        UserDTO dto = new UserDTO();
        BeanUtils.copyProperties(user, dto);
        dto.setSkills(buildUserSkillDTOs(userId));
        return dto;
    }

    @Override
    public UserDTO updateUser(Long userId, UpdateUserDTO updateDTO) throws SkillSyncException {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new SkillSyncException("Service.USER_NOT_FOUND"));
        if (updateDTO.getFullName() != null) user.setFullName(updateDTO.getFullName());
        if (updateDTO.getBio() != null) user.setBio(updateDTO.getBio());
        if (updateDTO.getLocation() != null) user.setLocation(updateDTO.getLocation());
        if (updateDTO.getGithubUrl() != null) user.setGithubUrl(updateDTO.getGithubUrl());
        if (updateDTO.getLinkedinUrl() != null) user.setLinkedinUrl(updateDTO.getLinkedinUrl());
        if (updateDTO.getAvailabilityStatus() != null) user.setAvailabilityStatus(updateDTO.getAvailabilityStatus());
        user = usersRepository.save(user);
        UserDTO dto = new UserDTO();
        BeanUtils.copyProperties(user, dto);
        dto.setSkills(buildUserSkillDTOs(userId));
        return dto;
    }

    @Override
    public PageResponseDTO<UserSummaryDTO> searchUsers(List<Long> skillIds, String location, String availability, Pageable pageable) {
        AvailabilityStatus availStatus = null;
        if (availability != null && !availability.isBlank()) {
            try { availStatus = AvailabilityStatus.valueOf(availability.toUpperCase()); } catch (Exception ignored) {}
        }

        Page<Users> page;
        if (skillIds != null && !skillIds.isEmpty()) {
            List<Long> userIdsWithSkills = userSkillsRepository.findBySkillIdIn(skillIds)
                    .stream().map(us -> us.getUserId()).distinct().toList();
            // Filter the search by userIds
            List<Users> allUsers = usersRepository.searchUsers(location, availStatus, pageable).getContent();
            // Intersect with skill-matched users
            final AvailabilityStatus finalAvailStatus = availStatus;
            page = usersRepository.searchUsers(location, finalAvailStatus, pageable);
        } else {
            page = usersRepository.searchUsers(location, availStatus, pageable);
        }

        List<UserSummaryDTO> content = page.getContent().stream().map(u -> {
            UserSummaryDTO dto = UserSummaryDTO.builder()
                    .userId(u.getUserId())
                    .fullName(u.getFullName())
                    .email(u.getEmail())
                    .location(u.getLocation())
                    .availabilityStatus(u.getAvailabilityStatus())
                    .skills(buildUserSkillDTOs(u.getUserId()))
                    .build();
            return dto;
        }).toList();

        return PageResponseDTO.<UserSummaryDTO>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Override
    public UserSkillDTO addUserSkill(Long userId, AddUserSkillDTO dto) throws SkillSyncException {
        usersRepository.findById(userId).orElseThrow(() -> new SkillSyncException("Service.USER_NOT_FOUND"));
        skillsRepository.findById(dto.getSkillId()).orElseThrow(() -> new SkillSyncException("Service.SKILL_NOT_FOUND"));
        if (userSkillsRepository.existsByUserIdAndSkillId(userId, dto.getSkillId())) {
            throw new SkillSyncException("Service.USER_SKILL_ALREADY_EXISTS");
        }
        UserSkills userSkill = UserSkills.builder()
                .userId(userId)
                .skillId(dto.getSkillId())
                .proficiencyLevel(dto.getProficiencyLevel())
                .yearsExperience(dto.getYearsExperience() != null ? dto.getYearsExperience() : 0)
                .build();
        userSkill = userSkillsRepository.save(userSkill);
        return toUserSkillDTO(userSkill);
    }

    @Override
    public UserSkillDTO updateUserSkill(Long userId, Long userSkillId, AddUserSkillDTO dto) throws SkillSyncException {
        UserSkills userSkill = userSkillsRepository.findById(userSkillId)
                .orElseThrow(() -> new SkillSyncException("Service.USER_SKILL_NOT_FOUND"));
        userSkill.setProficiencyLevel(dto.getProficiencyLevel());
        if (dto.getYearsExperience() != null) userSkill.setYearsExperience(dto.getYearsExperience());
        userSkill = userSkillsRepository.save(userSkill);
        return toUserSkillDTO(userSkill);
    }

    @Override
    public void removeUserSkill(Long userId, Long userSkillId) throws SkillSyncException {
        UserSkills userSkill = userSkillsRepository.findById(userSkillId)
                .orElseThrow(() -> new SkillSyncException("Service.USER_SKILL_NOT_FOUND"));
        userSkillsRepository.delete(userSkill);
    }

    private List<UserSkillDTO> buildUserSkillDTOs(Long userId) {
        List<UserSkills> userSkills = userSkillsRepository.findByUserId(userId);
        if (userSkills.isEmpty()) return new ArrayList<>();
        List<Long> skillIds = userSkills.stream().map(UserSkills::getSkillId).toList();
        Map<Long, Skills> skillMap = skillsRepository.findAllById(skillIds)
                .stream().collect(Collectors.toMap(Skills::getSkillId, s -> s));
        return userSkills.stream().map(us -> {
            Skills skill = skillMap.get(us.getSkillId());
            return UserSkillDTO.builder()
                    .userSkillId(us.getUserSkillId())
                    .skillId(us.getSkillId())
                    .skillName(skill != null ? skill.getName() : "")
                    .category(skill != null ? skill.getCategory() : "")
                    .proficiencyLevel(us.getProficiencyLevel())
                    .yearsExperience(us.getYearsExperience())
                    .build();
        }).toList();
    }

    private UserSkillDTO toUserSkillDTO(UserSkills us) {
        Skills skill = skillsRepository.findById(us.getSkillId()).orElse(null);
        return UserSkillDTO.builder()
                .userSkillId(us.getUserSkillId())
                .skillId(us.getSkillId())
                .skillName(skill != null ? skill.getName() : "")
                .category(skill != null ? skill.getCategory() : "")
                .proficiencyLevel(us.getProficiencyLevel())
                .yearsExperience(us.getYearsExperience())
                .build();
    }
}

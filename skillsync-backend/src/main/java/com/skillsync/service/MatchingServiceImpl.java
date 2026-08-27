package com.skillsync.service;

import com.skillsync.dto.*;
import com.skillsync.entity.*;
import com.skillsync.repository.*;
import com.skillsync.utility.SkillSyncException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service(value = "matchingService")
@Transactional(readOnly = true)
public class MatchingServiceImpl implements MatchingService {

    private final ProjectsRepository projectsRepo;
    private final ProjectSkillsRepository projectSkillsRepo;
    private final ProjectMembersRepository membersRepo;
    private final UsersRepository usersRepo;
    private final UserSkillsRepository userSkillsRepo;
    private final SkillsRepository skillsRepo;

    public MatchingServiceImpl(ProjectsRepository projectsRepo,
                               ProjectSkillsRepository projectSkillsRepo,
                               ProjectMembersRepository membersRepo,
                               UsersRepository usersRepo,
                               UserSkillsRepository userSkillsRepo,
                               SkillsRepository skillsRepo) {
        this.projectsRepo = projectsRepo;
        this.projectSkillsRepo = projectSkillsRepo;
        this.membersRepo = membersRepo;
        this.usersRepo = usersRepo;
        this.userSkillsRepo = userSkillsRepo;
        this.skillsRepo = skillsRepo;
    }

    @Override
    public List<MatchedUserDTO> findMatchesForProject(Long projectId) throws SkillSyncException {
        projectsRepo.findById(projectId).orElseThrow(() -> new SkillSyncException("Service.PROJECT_NOT_FOUND"));

        List<Long> requiredSkillIds = projectSkillsRepo.findByProjectId(projectId)
                .stream().map(ProjectSkills::getSkillId).toList();
        if (requiredSkillIds.isEmpty()) return Collections.emptyList();

        Set<Long> existingMemberIds = membersRepo.findByProjectId(projectId)
                .stream().map(ProjectMembers::getUserId).collect(Collectors.toSet());

        Map<Long, Skills> skillMap = skillsRepo.findAllById(requiredSkillIds)
                .stream().collect(Collectors.toMap(Skills::getSkillId, s -> s));

        Map<Long, List<UserSkills>> userSkillsByUser = userSkillsRepo.findBySkillIdIn(requiredSkillIds)
                .stream()
                .filter(us -> !existingMemberIds.contains(us.getUserId()))
                .collect(Collectors.groupingBy(UserSkills::getUserId));

        List<MatchedUserDTO> results = new ArrayList<>();
        for (Map.Entry<Long, List<UserSkills>> entry : userSkillsByUser.entrySet()) {
            Long userId = entry.getKey();
            List<UserSkills> matchedSkills = entry.getValue();
            int score = matchedSkills.stream()
                    .mapToInt(us -> us.getProficiencyLevel().getWeight()).sum();
            Users user = usersRepo.findById(userId).orElse(null);
            if (user == null || !user.getActive()) continue;

            List<UserSkillDTO> skillDTOs = matchedSkills.stream().map(us -> {
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

            results.add(MatchedUserDTO.builder()
                    .userId(userId)
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .location(user.getLocation())
                    .matchScore(score)
                    .matchingSkills(skillDTOs)
                    .build());
        }
        results.sort(Comparator.comparingInt(MatchedUserDTO::getMatchScore).reversed());
        return results;
    }

    @Override
    public List<MatchedProjectDTO> findMatchingProjects(Long userId) throws SkillSyncException {
        usersRepo.findById(userId).orElseThrow(() -> new SkillSyncException("Service.USER_NOT_FOUND"));

        List<Long> userSkillIds = userSkillsRepo.findByUserId(userId)
                .stream().map(UserSkills::getSkillId).toList();
        if (userSkillIds.isEmpty()) return Collections.emptyList();

        Map<Long, List<ProjectSkills>> projectSkillsByProject = projectSkillsRepo.findBySkillIdIn(userSkillIds)
                .stream().collect(Collectors.groupingBy(ProjectSkills::getProjectId));

        Map<Long, Skills> skillMap = skillsRepo.findAllById(userSkillIds)
                .stream().collect(Collectors.toMap(Skills::getSkillId, s -> s));

        Map<Long, Integer> userSkillWeights = userSkillsRepo.findByUserId(userId)
                .stream().collect(Collectors.toMap(UserSkills::getSkillId,
                        us -> us.getProficiencyLevel().getWeight()));

        List<MatchedProjectDTO> results = new ArrayList<>();
        for (Map.Entry<Long, List<ProjectSkills>> entry : projectSkillsByProject.entrySet()) {
            Long projectId = entry.getKey();
            if (membersRepo.existsByProjectIdAndUserId(projectId, userId)) continue;

            Projects project = projectsRepo.findById(projectId).orElse(null);
            if (project == null) continue;

            List<ProjectSkills> matchedProjectSkills = entry.getValue();
            int score = matchedProjectSkills.stream()
                    .mapToInt(ps -> userSkillWeights.getOrDefault(ps.getSkillId(), 0)).sum();

            List<SkillDTO> skillDTOs = matchedProjectSkills.stream().map(ps -> {
                Skills skill = skillMap.get(ps.getSkillId());
                return SkillDTO.builder()
                        .skillId(ps.getSkillId())
                        .name(skill != null ? skill.getName() : "")
                        .category(skill != null ? skill.getCategory() : "")
                        .build();
            }).toList();

            String ownerName = usersRepo.findById(project.getOwnerId()).map(Users::getFullName).orElse("");
            long memberCount = membersRepo.countByProjectId(projectId);

            results.add(MatchedProjectDTO.builder()
                    .projectId(projectId)
                    .title(project.getTitle())
                    .description(project.getDescription())
                    .status(project.getStatus())
                    .ownerName(ownerName)
                    .memberCount((int) memberCount)
                    .maxTeamSize(project.getMaxTeamSize())
                    .matchScore(score)
                    .matchingSkills(skillDTOs)
                    .createdAt(project.getCreatedAt())
                    .build());
        }
        results.sort(Comparator.comparingInt(MatchedProjectDTO::getMatchScore).reversed());
        return results;
    }
}

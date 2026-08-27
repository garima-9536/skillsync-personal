package com.skillsync.dto;

import com.skillsync.enums.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchedProjectDTO {
    private Long projectId;
    private String title;
    private String description;
    private ProjectStatus status;
    private String ownerName;
    private Integer memberCount;
    private Integer maxTeamSize;
    private int matchScore;
    private List<SkillDTO> matchingSkills;
    private LocalDateTime createdAt;
}

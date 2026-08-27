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
public class ProjectDTO {
    private Long projectId;
    private String title;
    private String description;
    private ProjectStatus status;
    private Long ownerId;
    private String ownerName;
    private Integer maxTeamSize;
    private Integer memberCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<SkillDTO> requiredSkills;
    private List<ProjectMemberDTO> members;
}

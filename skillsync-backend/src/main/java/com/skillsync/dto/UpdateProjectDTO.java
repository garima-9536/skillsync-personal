package com.skillsync.dto;

import com.skillsync.enums.ProjectStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class UpdateProjectDTO {
    @Size(max = 200, message = "Title must be under 200 characters")
    private String title;

    private String description;
    private ProjectStatus status;

    @Min(value = 2, message = "Team size must be at least 2")
    private Integer maxTeamSize;

    private List<Long> requiredSkillIds;
}

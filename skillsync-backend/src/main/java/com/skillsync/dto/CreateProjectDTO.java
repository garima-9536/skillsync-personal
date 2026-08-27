package com.skillsync.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CreateProjectDTO {
    @NotBlank(message = "Project title is required")
    @Size(max = 200, message = "Title must be under 200 characters")
    private String title;

    private String description;

    @Min(value = 2, message = "Team size must be at least 2")
    private Integer maxTeamSize = 5;

    private List<Long> requiredSkillIds;
}

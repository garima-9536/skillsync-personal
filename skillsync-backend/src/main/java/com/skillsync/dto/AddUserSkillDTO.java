package com.skillsync.dto;

import com.skillsync.enums.ProficiencyLevel;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
//this layer ensures that the data is validated before it reaches the service layer, preventing any invalid data from being processed and potentially causing errors or inconsistencies in the application.
@Data
public class AddUserSkillDTO {
    @NotNull(message = "Skill ID is required")
    private Long skillId;

    @NotNull(message = "Proficiency level is required")
    private ProficiencyLevel proficiencyLevel;

    @Min(value = 0, message = "Years experience must be 0 or more")
    private Integer yearsExperience = 0;
}

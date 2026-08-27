package com.skillsync.dto;

import com.skillsync.enums.ProficiencyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSkillDTO {
    private Long userSkillId;
    private Long skillId;
    private String skillName;
    private String category;
    private ProficiencyLevel proficiencyLevel;
    private Integer yearsExperience;
}

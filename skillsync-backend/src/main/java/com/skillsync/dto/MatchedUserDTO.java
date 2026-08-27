package com.skillsync.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchedUserDTO {
    private Long userId;
    private String fullName;
    private String email;
    private String location;
    private int matchScore;
    private List<UserSkillDTO> matchingSkills;
}

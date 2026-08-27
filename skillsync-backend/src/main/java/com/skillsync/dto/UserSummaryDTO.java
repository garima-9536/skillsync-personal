package com.skillsync.dto;

import com.skillsync.enums.AvailabilityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDTO {
    private Long userId;
    private String fullName;
    private String email;
    private String location;
    private AvailabilityStatus availabilityStatus;
    private List<UserSkillDTO> skills;
}

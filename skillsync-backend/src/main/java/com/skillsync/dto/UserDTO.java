package com.skillsync.dto;

import com.skillsync.enums.AvailabilityStatus;
import com.skillsync.enums.RoleType;
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
public class UserDTO {
    private Long userId;
    private String fullName;
    private String email;
    private String bio;
    private String location;
    private String githubUrl;
    private String linkedinUrl;
    private RoleType role;
    private AvailabilityStatus availabilityStatus;
    private Boolean active;
    private LocalDateTime createdAt;
    private List<UserSkillDTO> skills;
}

package com.skillsync.dto;

import com.skillsync.enums.MemberRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMemberDTO {
    private Long userId;
    private String fullName;
    private String email;
    private MemberRole role;
    private LocalDateTime joinedAt;
}

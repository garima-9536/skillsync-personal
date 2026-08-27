package com.skillsync.dto;

import com.skillsync.enums.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDTO {
    private Long applicationId;
    private Long projectId;
    private String projectTitle;
    private Long applicantId;
    private String applicantName;
    private String message;
    private RequestStatus status;
    private LocalDateTime createdAt;
}

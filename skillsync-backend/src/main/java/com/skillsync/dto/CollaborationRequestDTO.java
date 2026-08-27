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
public class CollaborationRequestDTO {
    private Long requestId;
    private Long projectId;
    private String projectTitle;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String receiverName;
    private String message;
    private RequestStatus status;
    private LocalDateTime createdAt;
}

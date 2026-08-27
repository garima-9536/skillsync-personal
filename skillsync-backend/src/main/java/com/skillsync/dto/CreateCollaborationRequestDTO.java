package com.skillsync.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateCollaborationRequestDTO {
    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotNull(message = "Receiver ID is required")
    private Long receiverId;

    private String message;
}

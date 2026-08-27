package com.skillsync.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateApplicationDTO {
    @NotNull(message = "Project ID is required")
    private Long projectId;

    private String message;
}

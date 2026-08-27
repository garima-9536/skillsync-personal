package com.skillsync.dto;

import com.skillsync.enums.AvailabilityStatus;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserDTO {
    @Size(min = 2, max = 100, message = "Full name must be 2-100 characters")
    private String fullName;
    private String bio;
    private String location;
    private String githubUrl;
    private String linkedinUrl;
    private AvailabilityStatus availabilityStatus;
}

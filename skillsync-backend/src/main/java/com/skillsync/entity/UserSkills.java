package com.skillsync.entity;

import com.skillsync.enums.ProficiencyLevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_skills")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSkills {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userSkillId;

    private Long userId;
    private Long skillId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProficiencyLevel proficiencyLevel;

    @Column(nullable = false)
    private Integer yearsExperience;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        if (yearsExperience == null) yearsExperience = 0;
    }
}

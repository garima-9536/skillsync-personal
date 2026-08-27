package com.skillsync.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "project_skills")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectSkills {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectSkillId;

    private Long projectId;
    private Long skillId;

    @Column(nullable = false)
    private Boolean required;

    @PrePersist
    public void prePersist() {
        if (required == null) required = true;
    }
}

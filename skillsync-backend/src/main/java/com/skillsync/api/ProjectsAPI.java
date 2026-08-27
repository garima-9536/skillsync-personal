package com.skillsync.api;

import com.skillsync.dto.*;
import com.skillsync.service.ApplicationService;
import com.skillsync.service.ProjectsService;
import com.skillsync.utility.SkillSyncException;
import jakarta.validation.Valid;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectsAPI {

    private final ProjectsService projectsService;
    private final ApplicationService applicationService;
    private final Environment environment;

    public ProjectsAPI(ProjectsService projectsService,
                       ApplicationService applicationService,
                       Environment environment) {
        this.projectsService = projectsService;
        this.applicationService = applicationService;
        this.environment = environment;
    }

    private HttpHeaders responseHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("application-name", environment.getProperty("spring.application.name"));
        return headers;
    }

    @GetMapping
    public ResponseEntity<PageResponseDTO<ProjectSummaryDTO>> getProjects(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long skillId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok().headers(responseHeaders())
                .body(projectsService.getProjects(search, skillId, status, pageable));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ProjectSummaryDTO>> getMyProjects(@RequestParam Long ownerId) {
        return ResponseEntity.ok().headers(responseHeaders()).body(projectsService.getMyProjects(ownerId));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long projectId) throws SkillSyncException {
        return ResponseEntity.ok().headers(responseHeaders()).body(projectsService.getProjectById(projectId));
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestParam Long ownerId,
                                                    @Valid @RequestBody CreateProjectDTO dto) throws SkillSyncException {
        return ResponseEntity.ok().headers(responseHeaders()).body(projectsService.createProject(ownerId, dto));
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long projectId,
                                                    @RequestParam Long ownerId,
                                                    @Valid @RequestBody UpdateProjectDTO dto) throws SkillSyncException {
        return ResponseEntity.ok().headers(responseHeaders()).body(projectsService.updateProject(projectId, ownerId, dto));
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId,
                                              @RequestParam Long ownerId) throws SkillSyncException {
        projectsService.deleteProject(projectId, ownerId);
        return ResponseEntity.noContent().headers(responseHeaders()).build();
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<Void> removeMember(@PathVariable Long projectId,
                                             @PathVariable Long userId,
                                             @RequestParam Long ownerId) throws SkillSyncException {
        projectsService.removeMember(projectId, ownerId, userId);
        return ResponseEntity.noContent().headers(responseHeaders()).build();
    }

    @PostMapping("/{projectId}/apply")
    public ResponseEntity<ApplicationDTO> applyToProject(@PathVariable Long projectId,
                                                         @RequestParam Long applicantId,
                                                         @RequestBody(required = false) CreateApplicationDTO dto) throws SkillSyncException {
        if (dto == null) dto = new CreateApplicationDTO();
        dto.setProjectId(projectId);
        return ResponseEntity.ok().headers(responseHeaders()).body(applicationService.applyToProject(applicantId, dto));
    }

    @GetMapping("/{projectId}/applications")
    public ResponseEntity<List<ApplicationDTO>> getApplications(@PathVariable Long projectId,
                                                                @RequestParam Long ownerId) throws SkillSyncException {
        return ResponseEntity.ok().headers(responseHeaders())
                .body(applicationService.getApplicationsForProject(projectId, ownerId));
    }

    @PutMapping("/{projectId}/applications/{applicationId}/accept")
    public ResponseEntity<Void> acceptApplication(@PathVariable Long projectId,
                                                  @PathVariable Long applicationId,
                                                  @RequestParam Long ownerId) throws SkillSyncException {
        applicationService.acceptApplication(applicationId, ownerId);
        return ResponseEntity.ok().headers(responseHeaders()).build();
    }

    @PutMapping("/{projectId}/applications/{applicationId}/reject")
    public ResponseEntity<Void> rejectApplication(@PathVariable Long projectId,
                                                  @PathVariable Long applicationId,
                                                  @RequestParam Long ownerId) throws SkillSyncException {
        applicationService.rejectApplication(applicationId, ownerId);
        return ResponseEntity.ok().headers(responseHeaders()).build();
    }
}

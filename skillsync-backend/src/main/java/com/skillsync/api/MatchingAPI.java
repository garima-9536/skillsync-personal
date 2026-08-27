package com.skillsync.api;

import com.skillsync.dto.MatchedProjectDTO;
import com.skillsync.dto.MatchedUserDTO;
import com.skillsync.service.MatchingService;
import com.skillsync.utility.SkillSyncException;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matching")
public class MatchingAPI {

    private final MatchingService matchingService;
    private final Environment environment;

    public MatchingAPI(MatchingService matchingService, Environment environment) {
        this.matchingService = matchingService;
        this.environment = environment;
    }

    private HttpHeaders responseHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("application-name", environment.getProperty("spring.application.name"));
        return headers;
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<MatchedUserDTO>> matchUsersToProject(@PathVariable Long projectId) throws SkillSyncException {
        return ResponseEntity.ok().headers(responseHeaders()).body(matchingService.findMatchesForProject(projectId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MatchedProjectDTO>> matchProjectsToUser(@PathVariable Long userId) throws SkillSyncException {
        return ResponseEntity.ok().headers(responseHeaders()).body(matchingService.findMatchingProjects(userId));
    }
}

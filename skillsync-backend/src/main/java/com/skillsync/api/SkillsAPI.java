package com.skillsync.api;

import com.skillsync.dto.SkillDTO;
import com.skillsync.service.SkillsService;
import com.skillsync.utility.SkillSyncException;
import jakarta.validation.Valid;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillsAPI {

    private final SkillsService skillsService;
    private final Environment environment;

    public SkillsAPI(SkillsService skillsService, Environment environment) {
        this.skillsService = skillsService;
        this.environment = environment;
    }

    private HttpHeaders responseHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("application-name", environment.getProperty("spring.application.name"));
        return headers;
    }

    @GetMapping
    public ResponseEntity<List<SkillDTO>> getAllSkills(@RequestParam(required = false) String category) {
        return ResponseEntity.ok().headers(responseHeaders()).body(skillsService.getAllSkills(category));
    }

    @PostMapping
    public ResponseEntity<SkillDTO> createSkill(@Valid @RequestBody SkillDTO dto) throws SkillSyncException {
        return ResponseEntity.ok().headers(responseHeaders()).body(skillsService.createSkill(dto));
    }
}

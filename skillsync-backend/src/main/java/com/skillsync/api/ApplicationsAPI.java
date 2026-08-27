package com.skillsync.api;

import java.util.List;

import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skillsync.dto.ApplicationDTO;
import com.skillsync.service.ApplicationService;

@RestController
@RequestMapping("/api/applications")
public class ApplicationsAPI {

    private final ApplicationService applicationService;
    private final Environment environment;

    public ApplicationsAPI(ApplicationService applicationService, Environment environment) {
        this.applicationService = applicationService;
        this.environment = environment;
    }

    private HttpHeaders responseHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("application-name", environment.getProperty("spring.application.name"));
        return headers;
    }

    @GetMapping("/my")
    public ResponseEntity<List<ApplicationDTO>> getMyApplications(@RequestParam Long applicantId) {
        return ResponseEntity.ok().headers(responseHeaders()).body(applicationService.getMyApplications(applicantId));
    }
}

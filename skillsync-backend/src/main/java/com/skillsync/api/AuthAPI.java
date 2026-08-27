package com.skillsync.api;

import com.skillsync.dto.AuthResponseDTO;
import com.skillsync.dto.LoginRequestDTO;
import com.skillsync.dto.RegisterRequestDTO;
import com.skillsync.service.AuthService;
import com.skillsync.utility.SkillSyncException;
import jakarta.validation.Valid;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthAPI {

    private final AuthService authService;
    private final Environment environment;

    public AuthAPI(AuthService authService, Environment environment) {
        this.authService = authService;
        this.environment = environment;
    }

    private HttpHeaders responseHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("application-name", environment.getProperty("spring.application.name"));
        return headers;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO dto) throws SkillSyncException {
        AuthResponseDTO response = authService.register(dto);
        return ResponseEntity.ok().headers(responseHeaders()).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) throws SkillSyncException {
        AuthResponseDTO response = authService.login(dto);
        return ResponseEntity.ok().headers(responseHeaders()).body(response);
    }
}

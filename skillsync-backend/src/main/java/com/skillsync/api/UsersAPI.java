package com.skillsync.api;

import java.util.List;

import org.springframework.core.env.Environment;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skillsync.dto.AddUserSkillDTO;
import com.skillsync.dto.PageResponseDTO;
import com.skillsync.dto.UpdateUserDTO;
import com.skillsync.dto.UserDTO;
import com.skillsync.dto.UserSkillDTO;
import com.skillsync.dto.UserSummaryDTO;
import com.skillsync.service.UsersService;
import com.skillsync.utility.SkillSyncException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UsersAPI {

    private final UsersService usersService;
    private final Environment environment;

    public UsersAPI(UsersService usersService, Environment environment) {
        this.usersService = usersService;
        this.environment = environment;
    }

    private HttpHeaders responseHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("application-name", environment.getProperty("spring.application.name"));
        return headers;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId) throws SkillSyncException {
        return ResponseEntity.ok().headers(responseHeaders()).body(usersService.getUserById(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long userId,
                                              @Valid @RequestBody UpdateUserDTO dto) throws SkillSyncException {
        return ResponseEntity.ok().headers(responseHeaders()).body(usersService.updateUser(userId, dto));
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponseDTO<UserSummaryDTO>> searchUsers(
            @RequestParam(required = false) List<Long> skillIds,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String availability,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("fullName").ascending());
        PageResponseDTO<UserSummaryDTO> result = usersService.searchUsers(skillIds, location, availability, pageable);
        return ResponseEntity.ok().headers(responseHeaders()).body(result);
    }

    @PostMapping("/{userId}/skills")
    public ResponseEntity<UserSkillDTO> addSkill(@PathVariable Long userId,
                                                 @Valid @RequestBody AddUserSkillDTO dto) throws SkillSyncException {
        return ResponseEntity.ok().headers(responseHeaders()).body(usersService.addUserSkill(userId, dto));
    }

    @PutMapping("/{userId}/skills/{userSkillId}")
    public ResponseEntity<UserSkillDTO> updateSkill(@PathVariable Long userId,
                                                    @PathVariable Long userSkillId,
                                                    @Valid @RequestBody AddUserSkillDTO dto) throws SkillSyncException {
        return ResponseEntity.ok().headers(responseHeaders()).body(usersService.updateUserSkill(userId, userSkillId, dto));
    }

    @DeleteMapping("/{userId}/skills/{userSkillId}")
    public ResponseEntity<Void> removeSkill(@PathVariable Long userId,
                                            @PathVariable Long userSkillId) throws SkillSyncException {
        usersService.removeUserSkill(userId, userSkillId);
        return ResponseEntity.noContent().headers(responseHeaders()).build();
    }
}

package com.skillsync.api;

import com.skillsync.dto.CollaborationRequestDTO;
import com.skillsync.dto.CreateCollaborationRequestDTO;
import com.skillsync.service.CollaborationService;
import com.skillsync.utility.SkillSyncException;
import jakarta.validation.Valid;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collaboration-requests")
public class CollaborationAPI {

    private final CollaborationService collaborationService;
    private final Environment environment;

    public CollaborationAPI(CollaborationService collaborationService, Environment environment) {
        this.collaborationService = collaborationService;
        this.environment = environment;
    }

    private HttpHeaders responseHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("application-name", environment.getProperty("spring.application.name"));
        return headers;
    }

    @PostMapping
    public ResponseEntity<CollaborationRequestDTO> sendRequest(@RequestParam Long senderId,
                                                               @Valid @RequestBody CreateCollaborationRequestDTO dto) throws SkillSyncException {
        return ResponseEntity.ok().headers(responseHeaders()).body(collaborationService.sendRequest(senderId, dto));
    }

    @GetMapping("/received")
    public ResponseEntity<List<CollaborationRequestDTO>> getReceived(@RequestParam Long userId) {
        return ResponseEntity.ok().headers(responseHeaders()).body(collaborationService.getReceivedRequests(userId));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<CollaborationRequestDTO>> getSent(@RequestParam Long userId) {
        return ResponseEntity.ok().headers(responseHeaders()).body(collaborationService.getSentRequests(userId));
    }

    @PutMapping("/{requestId}/accept")
    public ResponseEntity<Void> accept(@PathVariable Long requestId,
                                       @RequestParam Long userId) throws SkillSyncException {
        collaborationService.acceptRequest(requestId, userId);
        return ResponseEntity.ok().headers(responseHeaders()).build();
    }

    @PutMapping("/{requestId}/reject")
    public ResponseEntity<Void> reject(@PathVariable Long requestId,
                                       @RequestParam Long userId) throws SkillSyncException {
        collaborationService.rejectRequest(requestId, userId);
        return ResponseEntity.ok().headers(responseHeaders()).build();
    }
}

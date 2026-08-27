package com.skillsync.repository;

import com.skillsync.entity.CollaborationRequests;
import com.skillsync.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollaborationRequestsRepository extends JpaRepository<CollaborationRequests, Long> {
    List<CollaborationRequests> findByReceiverIdOrderByCreatedAtDesc(Long receiverId);
    List<CollaborationRequests> findBySenderIdOrderByCreatedAtDesc(Long senderId);
    boolean existsByProjectIdAndSenderIdAndStatus(Long projectId, Long senderId, RequestStatus status);
}

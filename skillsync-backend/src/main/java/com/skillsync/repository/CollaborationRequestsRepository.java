package com.skillsync.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.skillsync.entity.CollaborationRequests;
import com.skillsync.enums.RequestStatus;
//This layer is responsible for interacting with the database and performing CRUD operations on CollaborationRequests entities.
@Repository
public interface CollaborationRequestsRepository extends JpaRepository<CollaborationRequests, Long> {
    List<CollaborationRequests> findByReceiverIdOrderByCreatedAtDesc(Long receiverId);
    List<CollaborationRequests> findBySenderIdOrderByCreatedAtDesc(Long senderId);
    boolean existsByProjectIdAndSenderIdAndStatus(Long projectId, Long senderId, RequestStatus status);
}

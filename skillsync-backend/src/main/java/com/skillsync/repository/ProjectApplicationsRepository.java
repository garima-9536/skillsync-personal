package com.skillsync.repository;

import com.skillsync.entity.ProjectApplications;
import com.skillsync.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectApplicationsRepository extends JpaRepository<ProjectApplications, Long> {
    List<ProjectApplications> findByProjectIdOrderByCreatedAtDesc(Long projectId);
    List<ProjectApplications> findByApplicantIdOrderByCreatedAtDesc(Long applicantId);
    boolean existsByProjectIdAndApplicantId(Long projectId, Long applicantId);
    List<ProjectApplications> findByProjectIdAndStatus(Long projectId, RequestStatus status);
}

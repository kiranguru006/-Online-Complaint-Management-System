package com.complaint.system.repository;

import com.complaint.system.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Optional<Feedback> findByComplaintId(Long complaintId);
    boolean existsByComplaintId(Long complaintId);
}

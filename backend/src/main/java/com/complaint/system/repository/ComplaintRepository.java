package com.complaint.system.repository;

import com.complaint.system.entity.Complaint;
import com.complaint.system.enums.ComplaintStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    Optional<Complaint> findByComplaintNumber(String complaintNumber);

    List<Complaint> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Complaint> findByAssignedStaffIdOrderByCreatedAtDesc(Long staffId);

    @Query("SELECT c FROM Complaint c WHERE " +
           "(:userId IS NULL OR c.user.id = :userId) AND " +
           "(:staffId IS NULL OR (c.assignedStaff IS NOT NULL AND c.assignedStaff.id = :staffId)) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:categoryId IS NULL OR c.category.id = :categoryId) AND " +
           "(:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.complaintNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY c.createdAt DESC")
    List<Complaint> filterComplaints(
            @Param("userId") Long userId,
            @Param("staffId") Long staffId,
            @Param("status") ComplaintStatus status,
            @Param("categoryId") Long categoryId,
            @Param("search") String search);

    @Query("SELECT c FROM Complaint c WHERE c.status NOT IN ('RESOLVED', 'CLOSED', 'REJECTED') AND c.createdAt < :cutoffDate AND c.isEscalated = false")
    List<Complaint> findUnresolvedOlderThan(@Param("cutoffDate") LocalDateTime cutoffDate);

    long countByStatus(ComplaintStatus status);

    long countByIsEscalatedTrue();

    @Query("SELECT c.category.name, COUNT(c) FROM Complaint c GROUP BY c.category.name")
    List<Object[]> countComplaintsByCategory();

    @Query("SELECT c.status, COUNT(c) FROM Complaint c GROUP BY c.status")
    List<Object[]> countComplaintsByStatus();
}

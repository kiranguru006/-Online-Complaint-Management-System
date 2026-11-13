package com.complaint.system.service;

import com.complaint.system.dto.ComplaintAssignRequest;
import com.complaint.system.dto.ComplaintCreateRequest;
import com.complaint.system.dto.ComplaintStatusUpdateRequest;
import com.complaint.system.entity.*;
import com.complaint.system.enums.ComplaintStatus;
import com.complaint.system.enums.Priority;
import com.complaint.system.enums.RoleType;
import com.complaint.system.exception.BadRequestException;
import com.complaint.system.exception.ResourceNotFoundException;
import com.complaint.system.repository.CategoryRepository;
import com.complaint.system.repository.ComplaintRepository;
import com.complaint.system.repository.ComplaintUpdateRepository;
import com.complaint.system.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ComplaintUpdateRepository complaintUpdateRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;

    public ComplaintService(ComplaintRepository complaintRepository,
                            CategoryRepository categoryRepository,
                            UserRepository userRepository,
                            ComplaintUpdateRepository complaintUpdateRepository,
                            FileStorageService fileStorageService,
                            NotificationService notificationService) {
        this.complaintRepository = complaintRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.complaintUpdateRepository = complaintUpdateRepository;
        this.fileStorageService = fileStorageService;
        this.notificationService = notificationService;
    }

    private synchronized String generateNextComplaintNumber() {
        int currentYear = Year.now().getValue();
        long count = complaintRepository.count() + 1;
        return String.format("CMP-%d-%04d", currentYear, count);
    }

    @Transactional
    public Complaint createComplaint(Long userId, ComplaintCreateRequest request, MultipartFile imageFile) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        Complaint complaint = new Complaint();
        complaint.setComplaintNumber(generateNextComplaintNumber());
        complaint.setTitle(request.getTitle().trim());
        complaint.setDescription(request.getDescription().trim());
        complaint.setCategory(category);
        complaint.setUser(user);
        complaint.setPriority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM);
        complaint.setStatus(ComplaintStatus.SUBMITTED);
        complaint.setLocation(request.getLocation() != null ? request.getLocation().trim() : null);

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = fileStorageService.storeFile(imageFile);
            complaint.setImageUrl(imageUrl);
        }

        Complaint savedComplaint = complaintRepository.save(complaint);

        // Record initial status update
        ComplaintUpdate initialUpdate = new ComplaintUpdate(
                savedComplaint,
                user,
                null,
                ComplaintStatus.SUBMITTED,
                "Complaint filed successfully"
        );
        complaintUpdateRepository.save(initialUpdate);

        // Notify user
        notificationService.createNotification(
                user,
                "Complaint Filed: " + savedComplaint.getComplaintNumber(),
                "Your complaint '" + savedComplaint.getTitle() + "' has been submitted and is under review.",
                savedComplaint.getId(),
                savedComplaint.getComplaintNumber()
        );

        return savedComplaint;
    }

    public List<Complaint> getAllComplaints() {
        checkAndEscalateOldComplaints();
        return complaintRepository.findAll();
    }

    public List<Complaint> getComplaintsByUser(Long userId) {
        checkAndEscalateOldComplaints();
        return complaintRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Complaint> getComplaintsByStaff(Long staffId) {
        checkAndEscalateOldComplaints();
        return complaintRepository.findByAssignedStaffIdOrderByCreatedAtDesc(staffId);
    }

    public Complaint getComplaintById(Long id) {
        checkAndEscalateOldComplaints();
        return complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + id));
    }

    public Complaint getComplaintByNumber(String complaintNumber) {
        checkAndEscalateOldComplaints();
        return complaintRepository.findByComplaintNumber(complaintNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with number: " + complaintNumber));
    }

    public Map<String, Object> trackComplaint(String complaintNumber) {
        checkAndEscalateOldComplaints();
        Complaint complaint = getComplaintByNumber(complaintNumber);
        List<ComplaintUpdate> timeline = complaintUpdateRepository.findByComplaintIdOrderByCreatedAtAsc(complaint.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("complaint", complaint);
        response.put("timeline", timeline);
        return response;
    }

    public List<ComplaintUpdate> getComplaintTimeline(Long complaintId) {
        return complaintUpdateRepository.findByComplaintIdOrderByCreatedAtAsc(complaintId);
    }

    public List<Complaint> filterComplaints(Long userId, Long staffId, ComplaintStatus status, Long categoryId, String search) {
        checkAndEscalateOldComplaints();
        return complaintRepository.filterComplaints(userId, staffId, status, categoryId, search);
    }

    @Transactional
    public Complaint assignComplaint(Long complaintId, ComplaintAssignRequest request, User adminUser) {
        Complaint complaint = getComplaintById(complaintId);
        User staff = userRepository.findById(request.getStaffId())
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with ID: " + request.getStaffId()));

        if (staff.getRole().getName() != RoleType.ROLE_STAFF && staff.getRole().getName() != RoleType.ROLE_ADMIN) {
            throw new BadRequestException("Selected user is not assigned to a staff/admin role");
        }

        ComplaintStatus previousStatus = complaint.getStatus();
        complaint.setAssignedStaff(staff);
        complaint.setStatus(ComplaintStatus.ASSIGNED);
        complaint.setUpdatedAt(LocalDateTime.now());

        Complaint saved = complaintRepository.save(complaint);

        String remarks = (request.getRemarks() != null && !request.getRemarks().trim().isEmpty())
                ? request.getRemarks().trim()
                : "Assigned to staff " + staff.getFullName();

        ComplaintUpdate update = new ComplaintUpdate(complaint, adminUser, previousStatus, ComplaintStatus.ASSIGNED, remarks);
        complaintUpdateRepository.save(update);

        // Notify Staff
        notificationService.createNotification(
                staff,
                "New Assignment: " + complaint.getComplaintNumber(),
                "Complaint '" + complaint.getTitle() + "' has been assigned to you.",
                complaint.getId(),
                complaint.getComplaintNumber()
        );

        // Notify User
        notificationService.createNotification(
                complaint.getUser(),
                "Staff Assigned: " + complaint.getComplaintNumber(),
                "Your complaint '" + complaint.getTitle() + "' has been assigned to " + staff.getFullName() + ".",
                complaint.getId(),
                complaint.getComplaintNumber()
        );

        return saved;
    }

    @Transactional
    public Complaint updateComplaintStatus(Long complaintId, ComplaintStatusUpdateRequest request, User updatedBy) {
        Complaint complaint = getComplaintById(complaintId);
        ComplaintStatus previousStatus = complaint.getStatus();
        ComplaintStatus newStatus = request.getStatus();

        complaint.setStatus(newStatus);
        complaint.setUpdatedAt(LocalDateTime.now());

        if (newStatus == ComplaintStatus.RESOLVED || newStatus == ComplaintStatus.CLOSED) {
            if (complaint.getResolvedAt() == null) {
                complaint.setResolvedAt(LocalDateTime.now());
            }
        }

        Complaint saved = complaintRepository.save(complaint);

        ComplaintUpdate update = new ComplaintUpdate(
                complaint,
                updatedBy,
                previousStatus,
                newStatus,
                request.getRemarks()
        );
        complaintUpdateRepository.save(update);

        // Notify user about status change
        notificationService.createNotification(
                complaint.getUser(),
                "Status Updated: " + complaint.getComplaintNumber(),
                "Your complaint status is now '" + newStatus.name() + "'." + (request.getRemarks() != null ? " Remarks: " + request.getRemarks() : ""),
                complaint.getId(),
                complaint.getComplaintNumber()
        );

        return saved;
    }

    @Transactional
    public void checkAndEscalateOldComplaints() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(7);
        List<Complaint> overdue = complaintRepository.findUnresolvedOlderThan(cutoff);
        for (Complaint c : overdue) {
            c.setEscalated(true);
            complaintRepository.save(c);

            // Record escalation remark if not recorded
            ComplaintUpdate escalationUpdate = new ComplaintUpdate(
                    c,
                    null,
                    c.getStatus(),
                    c.getStatus(),
                    "ESCALATION: Complaint has remained unresolved for more than 7 days."
            );
            complaintUpdateRepository.save(escalationUpdate);

            // Notify user & staff
            if (c.getUser() != null) {
                notificationService.createNotification(
                        c.getUser(),
                        "Complaint Escalated: " + c.getComplaintNumber(),
                        "Your complaint has been automatically escalated due to exceeding 7 days.",
                        c.getId(),
                        c.getComplaintNumber()
                );
            }
            if (c.getAssignedStaff() != null) {
                notificationService.createNotification(
                        c.getAssignedStaff(),
                        "ESCALATION ALERT: " + c.getComplaintNumber(),
                        "Complaint '" + c.getTitle() + "' assigned to you is overdue (>7 days) and marked escalated.",
                        c.getId(),
                        c.getComplaintNumber()
                );
            }
        }
    }
}

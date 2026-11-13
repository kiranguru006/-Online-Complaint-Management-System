package com.complaint.system.controller;

import com.complaint.system.dto.ApiResponse;
import com.complaint.system.dto.ComplaintAssignRequest;
import com.complaint.system.dto.ComplaintCreateRequest;
import com.complaint.system.dto.ComplaintStatusUpdateRequest;
import com.complaint.system.entity.Complaint;
import com.complaint.system.entity.ComplaintUpdate;
import com.complaint.system.entity.User;
import com.complaint.system.enums.ComplaintStatus;
import com.complaint.system.enums.Priority;
import com.complaint.system.enums.RoleType;
import com.complaint.system.security.CustomUserDetails;
import com.complaint.system.service.ComplaintService;
import com.complaint.system.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;
    private final UserService userService;

    public ComplaintController(ComplaintService complaintService, UserService userService) {
        this.complaintService = complaintService;
        this.userService = userService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Complaint>> fileComplaint(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "priority", defaultValue = "MEDIUM") Priority priority,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {

        ComplaintCreateRequest request = new ComplaintCreateRequest();
        request.setTitle(title);
        request.setDescription(description);
        request.setCategoryId(categoryId);
        request.setPriority(priority);
        request.setLocation(location);

        Complaint complaint = complaintService.createComplaint(userDetails.getId(), request, imageFile);
        return ResponseEntity.ok(ApiResponse.success("Complaint filed successfully", complaint));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Complaint>>> getComplaints(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(value = "status", required = false) ComplaintStatus status,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "search", required = false) String search) {

        Long userId = null;
        Long staffId = null;

        if (userDetails.getRole() == RoleType.ROLE_USER) {
            userId = userDetails.getId();
        } else if (userDetails.getRole() == RoleType.ROLE_STAFF) {
            staffId = userDetails.getId();
        }
        // If ADMIN, both userId and staffId remain null, returning all complaints!

        List<Complaint> list = complaintService.filterComplaints(userId, staffId, status, categoryId, search);
        return ResponseEntity.ok(ApiResponse.success("Complaints retrieved", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Complaint>> getComplaintById(@PathVariable Long id) {
        Complaint complaint = complaintService.getComplaintById(id);
        return ResponseEntity.ok(ApiResponse.success("Complaint details", complaint));
    }

    @GetMapping("/track/{complaintNumber}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> trackComplaint(@PathVariable String complaintNumber) {
        Map<String, Object> data = complaintService.trackComplaint(complaintNumber);
        return ResponseEntity.ok(ApiResponse.success("Complaint tracking details", data));
    }

    @GetMapping("/{id}/timeline")
    public ResponseEntity<ApiResponse<List<ComplaintUpdate>>> getTimeline(@PathVariable Long id) {
        List<ComplaintUpdate> timeline = complaintService.getComplaintTimeline(id);
        return ResponseEntity.ok(ApiResponse.success("Complaint timeline", timeline));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Complaint>> assignComplaint(
            @PathVariable Long id,
            @Valid @RequestBody ComplaintAssignRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        User adminUser = userService.getUserById(userDetails.getId());
        Complaint updated = complaintService.assignComplaint(id, request, adminUser);
        return ResponseEntity.ok(ApiResponse.success("Complaint assigned successfully", updated));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<ApiResponse<Complaint>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ComplaintStatusUpdateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        User currentUser = userService.getUserById(userDetails.getId());
        Complaint updated = complaintService.updateComplaintStatus(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Complaint status updated", updated));
    }
}

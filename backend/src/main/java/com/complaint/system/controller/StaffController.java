package com.complaint.system.controller;

import com.complaint.system.dto.ApiResponse;
import com.complaint.system.entity.Complaint;
import com.complaint.system.security.CustomUserDetails;
import com.complaint.system.service.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
public class StaffController {

    private final ComplaintService complaintService;

    public StaffController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping("/complaints")
    public ResponseEntity<ApiResponse<List<Complaint>>> getAssignedComplaints(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Complaint> list = complaintService.getComplaintsByStaff(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Staff assigned complaints", list));
    }
}

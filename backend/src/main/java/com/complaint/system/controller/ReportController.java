package com.complaint.system.controller;

import com.complaint.system.dto.ApiResponse;
import com.complaint.system.dto.DashboardStatsResponse;
import com.complaint.system.entity.Complaint;
import com.complaint.system.enums.ComplaintStatus;
import com.complaint.system.service.ComplaintService;
import com.complaint.system.service.ReportService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    private final ReportService reportService;
    private final ComplaintService complaintService;

    public ReportController(ReportService reportService, ComplaintService complaintService) {
        this.reportService = reportService;
        this.complaintService = complaintService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = reportService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard metrics", stats));
    }

    @GetMapping("/export/csv")
    public ResponseEntity<InputStreamResource> exportComplaintsCsv(
            @RequestParam(value = "status", required = false) ComplaintStatus status,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "search", required = false) String search) {

        List<Complaint> complaints = complaintService.filterComplaints(null, null, status, categoryId, search);
        ByteArrayInputStream in = reportService.exportComplaintsToCsv(complaints);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=complaints_report.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new InputStreamResource(in));
    }
}

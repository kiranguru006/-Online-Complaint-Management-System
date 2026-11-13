package com.complaint.system.controller;

import com.complaint.system.dto.ApiResponse;
import com.complaint.system.dto.FeedbackRequest;
import com.complaint.system.entity.Feedback;
import com.complaint.system.security.CustomUserDetails;
import com.complaint.system.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping("/{complaintId}")
    public ResponseEntity<ApiResponse<Feedback>> submitFeedback(
            @PathVariable Long complaintId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody FeedbackRequest request) {

        Feedback feedback = feedbackService.submitFeedback(complaintId, userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Thank you for your feedback!", feedback));
    }

    @GetMapping("/{complaintId}")
    public ResponseEntity<ApiResponse<Feedback>> getFeedback(@PathVariable Long complaintId) {
        return feedbackService.getFeedbackByComplaintId(complaintId)
                .map(f -> ResponseEntity.ok(ApiResponse.success("Feedback details", f)))
                .orElse(ResponseEntity.ok(ApiResponse.success("No feedback found", null)));
    }
}

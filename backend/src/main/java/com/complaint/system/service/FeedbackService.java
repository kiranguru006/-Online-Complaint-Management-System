package com.complaint.system.service;

import com.complaint.system.dto.FeedbackRequest;
import com.complaint.system.entity.Complaint;
import com.complaint.system.entity.Feedback;
import com.complaint.system.entity.User;
import com.complaint.system.enums.ComplaintStatus;
import com.complaint.system.exception.BadRequestException;
import com.complaint.system.exception.ResourceNotFoundException;
import com.complaint.system.repository.ComplaintRepository;
import com.complaint.system.repository.FeedbackRepository;
import com.complaint.system.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public FeedbackService(FeedbackRepository feedbackRepository,
                           ComplaintRepository complaintRepository,
                           UserRepository userRepository) {
        this.feedbackRepository = feedbackRepository;
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Feedback submitFeedback(Long complaintId, Long userId, FeedbackRequest request) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + complaintId));

        if (!complaint.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only submit feedback for your own complaint");
        }

        if (complaint.getStatus() != ComplaintStatus.RESOLVED && complaint.getStatus() != ComplaintStatus.CLOSED) {
            throw new BadRequestException("Feedback can only be submitted for RESOLVED or CLOSED complaints");
        }

        if (feedbackRepository.existsByComplaintId(complaintId)) {
            throw new BadRequestException("Feedback has already been submitted for this complaint");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Feedback feedback = new Feedback(complaint, user, request.getRating(), request.getComments());
        return feedbackRepository.save(feedback);
    }

    public Optional<Feedback> getFeedbackByComplaintId(Long complaintId) {
        return feedbackRepository.findByComplaintId(complaintId);
    }
}

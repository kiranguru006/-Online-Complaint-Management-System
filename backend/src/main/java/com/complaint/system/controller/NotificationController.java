package com.complaint.system.controller;

import com.complaint.system.dto.ApiResponse;
import com.complaint.system.entity.Notification;
import com.complaint.system.security.CustomUserDetails;
import com.complaint.system.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Notification> list = notificationService.getNotificationsForUser(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("User notifications", list));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        long count = notificationService.getUnreadCount(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Unread count", Map.of("unreadCount", count)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read"));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        notificationService.markAllAsRead(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read"));
    }
}

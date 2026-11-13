package com.complaint.system.controller;

import com.complaint.system.dto.ApiResponse;
import com.complaint.system.dto.UserUpdateRequest;
import com.complaint.system.entity.User;
import com.complaint.system.security.CustomUserDetails;
import com.complaint.system.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("Users list", userService.getAllUsers()));
    }

    @GetMapping("/staff-list")
    public ResponseEntity<ApiResponse<List<User>>> getStaffList() {
        return ResponseEntity.ok(ApiResponse.success("Active staff list", userService.getActiveStaff()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("User details", userService.getUserById(id)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UserUpdateRequest request) {
        User updated = userService.updateProfile(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> adminUpdateUser(
            @PathVariable Long id,
            @RequestBody UserUpdateRequest request) {
        User updated = userService.adminUpdateUser(id, request);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully by admin", updated));
    }
}

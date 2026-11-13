package com.complaint.system.controller;

import com.complaint.system.dto.ApiResponse;
import com.complaint.system.dto.AuthRequest;
import com.complaint.system.dto.AuthResponse;
import com.complaint.system.dto.RegisterRequest;
import com.complaint.system.entity.Role;
import com.complaint.system.entity.User;
import com.complaint.system.enums.RoleType;
import com.complaint.system.exception.BadRequestException;
import com.complaint.system.repository.RoleRepository;
import com.complaint.system.repository.UserRepository;
import com.complaint.system.security.CustomUserDetails;
import com.complaint.system.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          RoleRepository roleRepository,
                          PasswordEncoder encoder,
                          JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticateUser(@Valid @RequestBody AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();

        AuthResponse authResponse = new AuthResponse(
                jwt,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().getName(),
                user.getPhone()
        );

        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Email is already registered!");
        }

        RoleType roleType = signUpRequest.getRole() != null ? signUpRequest.getRole() : RoleType.ROLE_USER;
        Role role = roleRepository.findByName(roleType)
                .orElseThrow(() -> new BadRequestException("Role not found: " + roleType));

        User user = new User(
                signUpRequest.getFullName(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getPhone(),
                role
        );

        User savedUser = userRepository.save(user);

        // Authenticate new user automatically
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signUpRequest.getEmail(), signUpRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        AuthResponse authResponse = new AuthResponse(
                jwt,
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole().getName(),
                savedUser.getPhone()
        );

        return ResponseEntity.ok(ApiResponse.success("User registered successfully", authResponse));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Not authenticated"));
        }

        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        AuthResponse authResponse = new AuthResponse(
                null,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().getName(),
                user.getPhone()
        );

        return ResponseEntity.ok(ApiResponse.success("Current user details", authResponse));
    }
}

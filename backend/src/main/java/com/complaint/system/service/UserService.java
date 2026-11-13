package com.complaint.system.service;

import com.complaint.system.dto.UserUpdateRequest;
import com.complaint.system.entity.Department;
import com.complaint.system.entity.Role;
import com.complaint.system.entity.User;
import com.complaint.system.enums.RoleType;
import com.complaint.system.exception.BadRequestException;
import com.complaint.system.exception.ResourceNotFoundException;
import com.complaint.system.repository.DepartmentRepository;
import com.complaint.system.repository.RoleRepository;
import com.complaint.system.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository,
                       DepartmentRepository departmentRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getActiveStaff() {
        return userRepository.findActiveStaff(RoleType.ROLE_STAFF);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Transactional
    public User updateProfile(Long userId, UserUpdateRequest request) {
        User user = getUserById(userId);

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }

        if (request.getCurrentPassword() != null && request.getNewPassword() != null) {
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new BadRequestException("Current password does not match");
            }
            if (request.getNewPassword().length() < 6) {
                throw new BadRequestException("New password must be at least 6 characters");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Transactional
    public User adminUpdateUser(Long userId, UserUpdateRequest request) {
        User user = getUserById(userId);

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }
        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }
        if (request.getRole() != null) {
            Role role = roleRepository.findByName(request.getRole())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.getRole()));
            user.setRole(role);
        }
        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElse(null);
            user.setDepartment(department);
        }

        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
}

package com.complaint.system.repository;

import com.complaint.system.entity.User;
import com.complaint.system.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);

    List<User> findByRoleName(RoleType roleName);

    @Query("SELECT u FROM User u WHERE u.role.name = :roleName AND u.active = true")
    List<User> findActiveStaff(RoleType roleName);
}

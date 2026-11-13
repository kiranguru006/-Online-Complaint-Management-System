package com.complaint.system.security;

import com.complaint.system.entity.User;
import com.complaint.system.enums.RoleType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final Long id;
    private final String fullName;
    private final String email;
    private final String password;
    private final boolean active;
    private final RoleType role;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(Long id, String fullName, String email, String password, boolean active, RoleType role,
                             Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.active = active;
        this.role = role;
        this.authorities = authorities;
    }

    public static CustomUserDetails build(User user) {
        GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().getName().name());
        return new CustomUserDetails(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPassword(),
                user.isActive(),
                user.getRole().getName(),
                Collections.singletonList(authority)
        );
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public RoleType getRole() {
        return role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}

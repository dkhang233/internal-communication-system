package com.securemeet.models.user;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import com.securemeet.enums.Role;
import org.hibernate.annotations.Comment;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name = "user")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {
    @Id
    @Column(name = "email", unique = true, length = 100, nullable = false)
    private String email;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "role", nullable = false)
    @Comment(value = "0: admin, 1: manager, 2: employee")
    private Role role;

    private String avatar;

    @Column(name = "status")
    @Comment(value = "0: offline , 1: online")
    private int status;

    @Column(name = "last_login_time")
    private LocalDateTime lastLoginTime;

    public void setRole(Role role) {
        this.role = role;
    }

    public String getName() {
        return username;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;

    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;

    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

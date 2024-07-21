package com.securemeet.dtos.user;

import com.securemeet.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterUserDto {
    private String email;
    private Role role;
    private String password;
    private String username;

    public void setRole(int value) {
        switch (value) {
            case 0:
                this.role = Role.ADMIN;
                break;
            case 1:
                this.role = Role.MANAGER;
                break;
            case 2:
                this.role = Role.EMPLOYEE;
                break;
            default:
                throw new RuntimeException("Role not found");
        }
    }
}

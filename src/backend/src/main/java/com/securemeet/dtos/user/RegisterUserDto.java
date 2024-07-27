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
}

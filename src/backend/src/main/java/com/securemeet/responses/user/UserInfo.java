package com.securemeet.responses.user;

import com.securemeet.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfo {
    private String email;
    private String username;
    private Role[] roles;
    private String avatar;
    private int status;

    public UserInfo(String email, String username, Role role, String avatar, int status) {
        this.email = email;
        this.username = username;
        this.roles = new Role[] { role };
        this.avatar = avatar;
        this.status = status;
    }
}

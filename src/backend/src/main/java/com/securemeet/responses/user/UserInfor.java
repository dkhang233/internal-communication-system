package com.securemeet.responses.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfor {
    private String email;
    private String username;
    private int[] roles;
    private String avatar;
    private int status;

    public UserInfor(String email, String username, int role, String avatar, int status) {
        this.email = email;
        this.username = username;
        this.roles = new int[] { role };
        this.avatar = avatar;
        this.status = status;
    }
}

package com.securemeet.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

import com.securemeet.dtos.user.UserStatusDto;
import com.securemeet.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    /**
     * gửi thông tin đến tất cả người dùng về
     * trạng thái của một người dùng khi thay đổi
     * 
     * @param userStatusDto
     * @return
     */
    @MessageMapping("/user/status/{email}")
    @SendTo("/topic/status")
    public UserStatusDto handleUserStatus(@Payload UserStatusDto userStatusDto) {
        userService.setStatus(userStatusDto.getEmail(), userStatusDto.getStatus());
        return userStatusDto;
    }
}

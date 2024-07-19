package com.securemeet.controllers;

import java.util.List;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;

import com.securemeet.dtos.user.UserStatusDto;
import com.securemeet.responses.ApiResponseData;
import com.securemeet.responses.user.ContactResponse;
import com.securemeet.services.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/users")
@CrossOrigin(originPatterns = "**")
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

    /**
     * Lấy danh sách liên hệ cho người dùng hiện tại
     * 
     * @param authentication
     * @return
     */
    @GetMapping("/contacts")
    public ApiResponseData<List<ContactResponse>> getContacts(Authentication authentication) {
        ApiResponseData<List<ContactResponse>> result = new ApiResponseData<>(0,
                userService.getContacts(authentication), "");
        return result;
    }

    // Thêm một liên hệ cho người dùng hiện tại
    // @PostMapping("/contacts")
    // public ApiResponseData<List<ContactResponse>> addContact(@RequestBody Contact
    // contact,
    // Authentication authentication) {
    // ApiResponseData<List<ContactResponse>> result = new ApiResponseData<>(0,
    // userService.addContact(contact, authentication), "");
    // return result;
    // }

}

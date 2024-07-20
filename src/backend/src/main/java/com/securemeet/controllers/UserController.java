package com.securemeet.controllers;

import java.util.List;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.securemeet.dtos.user.UserStatusDto;
import com.securemeet.responses.ApiResponseData;
import com.securemeet.responses.user.ContactResponse;
import com.securemeet.responses.user.UserInfor;
import com.securemeet.services.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/users")
@CrossOrigin(originPatterns = "**")
public class UserController {
    private final UserService userService;
    private final SimpMessagingTemplate simpMessagingTemplate;

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

    @GetMapping("/search")
    public ApiResponseData<List<UserInfor>> searchUser(@RequestParam String keyword) {
        ApiResponseData<List<UserInfor>> result = new ApiResponseData<>(0,
                userService.searchContact(keyword), "");
        return result;
    }

    /**
     * Khi thiết lập kết nối websocket thành công
     * => người dùng online
     * => gửi thông tin này đến người dùng khác
     * 
     * @param event
     */
    @EventListener
    public void handleOnlineStatus(SessionConnectedEvent event) {
        UserStatusDto userStatusDto = userService.setStatus(event.getUser().getName(), 1);
        simpMessagingTemplate.convertAndSend("/topic/user/status", userStatusDto);
    }

    /**
     * Khi ngắt kết nối websocket thành công
     * => người dùng offline
     * => gửi thông tin này đến người dùng khác
     * 
     * @param event
     */
    @EventListener
    public void handleOfflineStatus(SessionDisconnectEvent event) {
        UserStatusDto userStatusDto = userService.setStatus(event.getUser().getName(), 0);
        simpMessagingTemplate.convertAndSend("/topic/user/status", userStatusDto);
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

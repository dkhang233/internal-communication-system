package com.securemeet.controllers;

import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;

import com.securemeet.responses.ApiResponseData;
import com.securemeet.responses.user.ContactResponse;
import com.securemeet.responses.user.UserInfo;
import com.securemeet.services.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/users")
public class UserController {
    private final UserService userService;
    private final SimpMessagingTemplate simpMessagingTemplate;


    @GetMapping("/info")
    public ApiResponseData<UserInfo> getUserInfo(Authentication authentication) {
        return ApiResponseData.success(userService.getUserInfo(authentication));
    }
    /**
     * Lấy danh sách liên hệ cho người dùng hiện tại
     * 
     * @param authentication
     * @return
     */
    @GetMapping("/contacts")
    public ApiResponseData<List<ContactResponse>> getContacts(Authentication authentication) {
        return ApiResponseData.success(userService.getContacts(authentication));
    }

    @GetMapping("/contact")
    public ApiResponseData<List<ContactResponse>> getSpecificContact(@RequestParam(value = "contactId") String contactId,Authentication authentication) {
        return ApiResponseData.success(userService.getContactByContactId(contactId,authentication));
    }
    @GetMapping("/search")
    public ApiResponseData<List<UserInfo>> searchUser(@RequestParam String keyword) {
        return ApiResponseData.success(userService.searchUser(keyword));
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

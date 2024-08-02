package com.securemeet.controllers;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

import com.securemeet.dtos.message.MessageDto;
import com.securemeet.models.message.Message;
import com.securemeet.responses.ApiResponseData;
import com.securemeet.services.ChatService;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/messages")
public class ChatController {

    private final ChatService chatService;

    // Lấy tất cả các tin nhắn liên quan đến người dùng đang đăng nhập
    @GetMapping("")
    public ApiResponseData<List<Message>> getMessages(@RequestParam(value = "page") int page, @RequestParam(value = "quantity") int quantity, Authentication authentication) {
        return ApiResponseData.success(chatService.getMessages(page, quantity, authentication));
    }

    // Gửi tin nhắn đến một người dùng xác định
    @PostMapping("/send")
    public ApiResponseData<Message> processMessage(@RequestBody MessageDto message) {
        return  ApiResponseData.success(chatService.handleSendMessage(message));
    }

    // Lấy tất cả tin nhắn giữa người dùng đang đăng nhập và một người dùng khác
    @GetMapping("/with")
    public ApiResponseData<List<Message>> getMessagesForSpecificContact(
            @RequestParam(value = "contactId") String contactId, @RequestParam(value = "page") int page, @RequestParam(value = "quantity") int quantity, Authentication authentication) {
        return  ApiResponseData.success(chatService.getMessageForSpecificContact(authentication, contactId, page, quantity));
    }

    @PostMapping("/read")
    public ApiResponseData<String>  handleReadMesssages(@RequestParam(value = "contactId") String contactId, @RequestParam(value = "lastMessageId") int lastMessageId, @RequestParam(value = "quantity") int quantity, Authentication authentication){
        chatService.handleReadMessages(contactId,lastMessageId,quantity,authentication);
        return ApiResponseData.success("");
    }

    

}

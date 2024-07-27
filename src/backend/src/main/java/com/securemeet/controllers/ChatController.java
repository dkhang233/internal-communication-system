package com.securemeet.controllers;

import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

import com.securemeet.dtos.message.MessageDto;
import com.securemeet.models.message.Message;
import com.securemeet.responses.ApiResponseData;
import com.securemeet.services.ChatService;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/chats")
@CrossOrigin(originPatterns = "**")
public class ChatController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatService chatService;

    // Lấy tất cả các tin nhắn liên quan đến người dùng đang đăng nhập
    @GetMapping("/messages")
    public ApiResponseData<List<Message>> getAllMessages() {
        return ApiResponseData.success(chatService.getAllMessages());
    }

    // Gửi tin nhắn đến một người dùng xác định
    @PostMapping("/messages/send")
    public ApiResponseData<Message> processMessage(@RequestBody MessageDto message) {
        Message saveMessage = chatService.handleMessage(message);
        simpMessagingTemplate.convertAndSendToUser( // chuyển đổi và gửi đến hàng đợi người dùng
                saveMessage.getRecipient(), // người nhận
                "/queue/receiveMsg", // điểm đến
                saveMessage // payload
        );
        return  ApiResponseData.success(saveMessage);
    }
    
    // Lấy tất cả tin nhắn giữa người dùng đang đăng nhập và một người dùng khác
    @GetMapping("/messages/contact")
    public ApiResponseData<List<Message>> getMessagesForSpecificContact(Authentication authentication,
            @RequestParam(value = "contactId") String contactId, @RequestParam(value = "pageNumber") int pageNumber) {
        return  ApiResponseData.success(chatService.getMessageForSpecificContact(authentication, contactId, pageNumber));
    }

}

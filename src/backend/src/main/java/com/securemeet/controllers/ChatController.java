package com.securemeet.controllers;

import java.util.List;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.securemeet.dtos.message.MessageDto;
import com.securemeet.models.message.Message;
import com.securemeet.responses.ApiResponseData;
import com.securemeet.responses.message.MessageResponse;
import com.securemeet.services.ChatService;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/chats")
@CrossOrigin(originPatterns = "**")
public class ChatController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatService chatService;

    // Gửi tin nhắn đến một người dùng xác định
    @MessageMapping("/messages")
    public void processMessage(@Payload MessageDto message) {
        MessageResponse saveMessage = chatService.handleMessage(message);
        simpMessagingTemplate.convertAndSendToUser( // chuyển đổi và gửi đến hàng đợi người dùng
                saveMessage.getRecipient(), // người nhận
                "/queue/messages", // điểm đến
                saveMessage // payload
        );
    }

    // Lấy tất cả các tin nhắn liên quan đến người dùng đang đăng nhập
    @GetMapping("/messages")
    public ApiResponseData<List<Message>> getAllMessages() {
        List<Message> response = chatService.getAllMessages();
        return new ApiResponseData<>(0, response, "");
    }

    // Lấy tất cả tin nhắn giữa người dùng đang đăng nhập và một người dùng khác
    @GetMapping("/messages/contact")
    public ApiResponseData<List<Message>> getMessagesForSpecificUser(Authentication authentication,
            @RequestParam String id) {
        List<Message> response = chatService.getMessageForSpecificContact(authentication, id);
        return new ApiResponseData<>(0, response, "");
    }

}

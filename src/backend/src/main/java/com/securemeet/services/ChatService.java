package com.securemeet.services;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.securemeet.dtos.message.MessageDto;
import com.securemeet.exceptionhandlers.DataNotFoundException;
import com.securemeet.models.message.Message;
import com.securemeet.models.user.User;
import com.securemeet.repositories.MessageRepository;
import com.securemeet.repositories.UserRepository;
import com.securemeet.responses.message.MessageResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageResponse handleMessage(MessageDto input) {
        // Kiểm tra người gửi có tồn tại hay không
        User sender = userRepository.findById(input.getSender())
                .orElseThrow(() -> new DataNotFoundException("Sender is incorrect"));
        // Kiểm tra người nhận có tồn tại hay không
        User recipient = userRepository.findById(input.getRecipient())
                .orElseThrow(() -> new DataNotFoundException("Recipient is incorrect"));
        // Tạo Message và lưa vào db
        Message message = Message.builder()
                .sender(sender.getEmail())
                .recipient(recipient.getEmail())
                .type(input.getType().getValue())
                .content(input.getContent())
                .sendedAt(input.getSendedAt())
                .build();
        message = messageRepository.save(message);

        // Tạo MessageResponse để trả về cho client
        MessageResponse response = MessageResponse.builder()
                .id(message.getId())
                .sender(message.getSender())
                .recipient(message.getRecipient())
                .type(message.getType())
                .content(message.getContent())
                .sendedAt(message.getSendedAt())
                .senderUsername(sender.getUsername())
                .recipientUsername(recipient.getUsername())
                .build();
        return response;
    }

    /*
     * Lấy 20 messages mới nhất giữa người liên hệ có id = contactId và người dùng
     */
    public List<Message> getMessageForSpecificContact(Authentication authentication, String contactId) {
        String myId = authentication.getName();
        List<Message> result = messageRepository.getMessagesForSpecificContact(myId, contactId);
        return result;
    }

    /**
     * Lấy tất cả messages liên quan đến người dùng hiện tại
     */
    public List<Message> getAllMessages() {
        List<Message> result = messageRepository.findAll();
        return result;
    }
}

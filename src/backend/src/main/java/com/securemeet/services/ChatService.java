package com.securemeet.services;

import java.util.List;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
        User sender = userRepository.findById(input.getSender())
                .orElseThrow(() -> new DataNotFoundException("Sender is incorrect"));
        User recipient = userRepository.findById(input.getRecipient())
                .orElseThrow(() -> new DataNotFoundException("Recipient is incorrect"));
        Message message = Message.builder()
                .sender(sender.getEmail())
                .recipient(recipient.getEmail())
                .type(input.getType().getValue())
                .content(input.getContent())
                .sendedAt(input.getSendedAt())
                .build();
        message = messageRepository.save(message);
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

    public List<Message> getMessageForSpecificUser(String id) {
        String myId = "";
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            myId = authentication.getName();
        } else {
            throw new RuntimeException("No User");
        }
        List<Message> result = messageRepository.getMessagesForSpecificUser(myId, id);
        return result;
    }

    public List<MessageResponse> getAllMessages() {
        List<MessageResponse> result = messageRepository.getAllMessages();
        return result;
    }
}

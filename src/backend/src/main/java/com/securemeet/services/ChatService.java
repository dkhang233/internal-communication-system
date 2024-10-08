package com.securemeet.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import com.securemeet.enums.MessageStatus;
import com.securemeet.responses.message.ReadMessageResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.securemeet.dtos.message.MessageDto;
import com.securemeet.exceptionhandlers.custom.DataNotFoundException;
import com.securemeet.models.message.Message;
import com.securemeet.models.user.Contact;
import com.securemeet.models.user.User;
import com.securemeet.repositories.ContactRepository;
import com.securemeet.repositories.MessageRepository;
import com.securemeet.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ContactRepository contactRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public Message handleSendMessage(MessageDto input) {
        // Kiểm tra người gửi có tồn tại hay không
        User sender = userRepository.findById(input.getSender())
                .orElseThrow(() -> new DataNotFoundException("Sender is incorrect"));
        // Kiểm tra người nhận có tồn tại hay không
        User recipient = userRepository.findById(input.getRecipient())
                .orElseThrow(() -> new DataNotFoundException("Recipient is incorrect"));

        // Kiểm tra liên hệ
        checkContact(sender.getEmail(), recipient.getEmail(), LocalDateTime.now());

        // Tạo Message và lưa vào db
        Message message = Message.builder()
                .sender(input.getSender())
                .recipient(input.getRecipient())
                .type(input.getType())
                .content(input.getContent())
                .sendedAt(LocalDateTime.now())
                .status(MessageStatus.SUCCESS).build();
        message = messageRepository.save(message);

        if(!input.getSender().equals(input.getRecipient())){
            simpMessagingTemplate.convertAndSendToUser( // chuyển đổi và gửi đến hàng đợi người dùng
                    message.getRecipient(), // người nhận
                    "/queue/receiveMsg", // điểm đến
                    message // payload
            );
        }
        // trả về cho người dùng
        return  message;
    }

    /**
     * Lấy các messages mới nhất giữa người liên hệ có id = contactId và người dùng, có phân trang
     */
    public List<Message> getMessageForSpecificContact(Authentication authentication, String contactId, int pageNumber , int quantity) {
        String myId = authentication.getName();
        Pageable pageable = PageRequest.of(pageNumber,quantity);
        return messageRepository.getMessagesForSpecificContact(myId, contactId, pageable).toList();
    }

    /**
     * Lấy messages liên quan đến người dùng hiện tại, có phân trang
     */
    public List<Message> getMessages(int page, int quantity , Authentication authentication) {
        Pageable pageable = PageRequest.of(page,quantity);
        return messageRepository.getMessages(authentication.getName(), pageable).toList();
    }

    /**
     * Tồn tại liên hệ giữa người gửi tin nhắn và người nhận tin nhắn
     * => Gửi tin nhắn
     * Nếu chưa tồn tại => Lưu liên hệ => Gửi tin nhắn
     */

    private void checkContact(String sender, String receiver, LocalDateTime contactTime) {

        // Lưu liên hệ cho người gửi tin nhắn nếu chưa tồn tại
        if (contactRepository.findByOwnerIdAndContactId(sender, receiver).isEmpty()) {
            Contact contact = Contact.builder().ownerId(sender).contactId(receiver).contactTime(contactTime).build();
            contactRepository.save(contact);
        }

        // Lưu liên hệ cho người nhận tin nhắn
        if (contactRepository.findByOwnerIdAndContactId(receiver, sender).isEmpty()) {
            Contact contact = Contact.builder().ownerId(receiver).contactId(sender).contactTime(contactTime).build();
            contactRepository.save(contact);
        }
        
        //Cập nhập thời gian nhắn tin gần nhất
        contactRepository.updateContactTime(sender,receiver,contactTime);

    }

    public void handleReadMessages(String contactId, int lastMessageId, int quantity, Authentication authentication) {
        if(lastMessageId < 0) return;
        if(quantity < 1)  return;
        messageRepository.updateReadMessageStatus( authentication.getName(),contactId,lastMessageId,quantity);
        simpMessagingTemplate.convertAndSendToUser(contactId,"/queue/updateMsgStatus", new ReadMessageResponse(authentication.getName(),lastMessageId,quantity));

    }
}

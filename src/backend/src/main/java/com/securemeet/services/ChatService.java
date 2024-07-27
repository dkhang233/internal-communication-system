package com.securemeet.services;

import java.util.Date;
import java.util.List;

import com.securemeet.enums.MessageStatus;
import com.securemeet.enums.MessageType;
import com.securemeet.exceptionhandlers.custom.InvalidDataException;
import com.securemeet.utils.BeanUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    public Message handleMessage(MessageDto input) {
        // Kiểm tra người gửi có tồn tại hay không
        User sender = userRepository.findById(input.getSender())
                .orElseThrow(() -> new DataNotFoundException("Sender is incorrect"));
        // Kiểm tra người nhận có tồn tại hay không
        User recipient = userRepository.findById(input.getRecipient())
                .orElseThrow(() -> new DataNotFoundException("Recipient is incorrect"));

        // Kiểm tra liên hệ
        checkContact(sender.getEmail(), recipient.getEmail(), input.getSendedAt());

        // Tạo Message và lưa vào db
        Message message = Message.builder()
                .sender(input.getSender())
                .recipient(input.getRecipient())
                .type(input.getType())
                .content(input.getContent())
                .sendedAt(new Date())
                .status(MessageStatus.SUCCESS).build();
        // trả về cho người dùng
        return messageRepository.save(message);
    }

    /*
     * Lấy 10 messages mới nhất giữa người liên hệ có id = contactId và người dùng
     */
    public List<Message> getMessageForSpecificContact(Authentication authentication, String contactId, int pageNumber) {
        String myId = authentication.getName();
        Pageable pageable = PageRequest.of(pageNumber,10);
        return messageRepository.getMessagesForSpecificContact(myId, contactId, pageable).toList();
    }

    /**
     * Lấy tất cả messages liên quan đến người dùng hiện tại
     */
    public List<Message> getAllMessages() {
        List<Message> result = messageRepository.findAll();
        return result;
    }

    /*
     * Tồn tại liên hệ giữa người gửi tin nhắn và người nhận tin nhắn
     * => Gửi tin nhắn
     * Nếu chưa tồn tại => Lưu liên hệ => Gửi tin nhắn
     */

    private void checkContact(String sender, String receiver, Date contactTime) {

        // Lưu liên hệ cho người gửi tin nhắn nếu chưa tồn tại
        if (contactRepository.findByOwnerIdAndContactId(sender, receiver).isEmpty()) {
            Contact contact = Contact.builder().ownerId(sender).contactId(receiver).contactTime(contactTime).build();
            contactRepository.save(contact);
        }else { // Nếu tồn tại rồi thì cập nhập thời gian nhắn tin gần nhất
            contactRepository.updateContactTime(sender,receiver,contactTime);
        }

        // Lưu liên hệ cho người nhận tin nhắn
        if (contactRepository.findByOwnerIdAndContactId(receiver, sender).isEmpty()) {
            Contact contact = Contact.builder().ownerId(receiver).contactId(sender).contactTime(contactTime).build();
            contactRepository.save(contact);
        }else { // Nếu tồn tại rồi thì cập nhập thời gian nhắn tin gần nhất
            contactRepository.updateContactTime(receiver,sender,contactTime);
        }
    }
}

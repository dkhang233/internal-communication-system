package com.securemeet.services;

import java.util.Date;
import java.util.List;

import com.securemeet.utils.BeanUtils;
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
        Message message = BeanUtils.copyProperties(input,Message.class);
        if(message != null){
            message = messageRepository.save(message);
        }
        // trả về cho người dùng
        return message;
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

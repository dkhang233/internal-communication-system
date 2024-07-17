package com.securemeet.services;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.securemeet.exceptionhandlers.DataNotFoundException;
import com.securemeet.exceptionhandlers.InvalidDataException;
import com.securemeet.models.user.Contact;
import com.securemeet.repositories.ContactRepository;
import com.securemeet.repositories.UserRepository;
import com.securemeet.responses.user.ContactResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final ContactRepository contactRepository;

    public void setStatus(String email, int status) {
        userRepository.findByEmail(email).orElseThrow(() -> new DataNotFoundException("Not found user"));
        if (status == 0 || status == 1) {
            userRepository.setStatus(email, status);
        } else {
            throw new InvalidDataException("User status is invalid"); // Nếu status không hợp lệ => đưa ra exception
        }
    }

    public List<ContactResponse> getContacts(Authentication authentication) {
        String ownerId = authentication.getName();
        List<ContactResponse> result = contactRepository.findByOwnerId(ownerId);
        return result;
    }

    public Contact addContact(Contact contact, Authentication authentication) {
        String ownerId = authentication.getName();

        // Kiểm tra xem liên hệ đã tồn tại chưa (đối với người dùng hiện tại)
        if (contactRepository.findByOwnerIdAndContactId(ownerId, contact.getContactId()).isPresent())
            throw new InvalidDataException("Contact ID is invalid"); // Nếu đã tồn tại => đưa ra exception

        // Nếu chưa tồn tại => lưu liên hệ
        return contactRepository.save(contact);
    }
}

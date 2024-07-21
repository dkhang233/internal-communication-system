package com.securemeet.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.securemeet.dtos.user.UserStatusDto;
import com.securemeet.exceptionhandlers.DataNotFoundException;
import com.securemeet.exceptionhandlers.InvalidDataException;
import com.securemeet.models.user.Contact;
import com.securemeet.repositories.ContactRepository;
import com.securemeet.repositories.UserRepository;
import com.securemeet.responses.user.ContactResponse;
import com.securemeet.responses.user.UserInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final ContactRepository contactRepository;

    // Thay đổi trạng thái(status) của người dùng
    public UserStatusDto setStatus(String email, int status) {
        userRepository.findByEmail(email).orElseThrow(() -> new DataNotFoundException("Not found user"));
        if (status == 0 || status == 1) {
            userRepository.setStatus(email, status);
        } else {
            throw new InvalidDataException("User status is invalid"); // Nếu status không hợp lệ => đưa ra exception
        }

        return new UserStatusDto(email, status);
    }

    // Lấy thông tin về các liên hệ của người dùng hiện tại
    public List<ContactResponse> getContacts(Authentication authentication) {
        String ownerId = authentication.getName();
        List<ContactResponse> result = contactRepository.findByOwnerId(ownerId);
        return result;
    }

    // Lấy thông tin về liên hệ có Id xác định của người dùng hiện tại
    public ContactResponse getContactByContactId(Authentication authentication, String contactId) {
        ContactResponse res = contactRepository.findByOwnerIdAndContactId(authentication.getName(), contactId)
                .orElseThrow(() -> new DataNotFoundException("Not found contact"));
        return res;
    }

    // Tìm kiếm người dùng
    public List<UserInfo> searchContact(String searchContact) {
        searchContact = searchContact.trim();
        if (searchContact.isEmpty()) {
            return List.of();
        }
        Pageable pageable = PageRequest.of(0,10);
        Page<UserInfo> result = userRepository.searchUser("%" + searchContact + "%",pageable );
        return result.getContent();
    }

    public List<ContactResponse> addContact(Contact contact, Authentication authentication) {
        String ownerId = authentication.getName();

        // Kiểm tra xem liên hệ đã tồn tại chưa (đối với người dùng hiện tại)
        if (contactRepository.findByOwnerIdAndContactId(ownerId, contact.getContactId()).isPresent())
            throw new InvalidDataException("Contact ID is invalid"); // Nếu đã tồn tại => đưa ra exception

        // Nếu chưa tồn tại => lưu liên hệ
        contactRepository.save(contact);
        ContactResponse res = contactRepository.findByOwnerIdAndContactId(ownerId, contact.getContactId())
                .orElseThrow(() -> new DataNotFoundException("Not found contact"));
        return List.of(res);
    }
}

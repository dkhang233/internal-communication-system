package com.securemeet.services;

import org.springframework.stereotype.Service;

import com.securemeet.exceptionhandlers.DataNotFoundException;
import com.securemeet.exceptionhandlers.InvalidDataException;
import com.securemeet.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public void setStatus(String email, int status) {
        userRepository.findByEmail(email).orElseThrow(() -> new DataNotFoundException("Not found user"));
        if (status == 0 || status == 1) {
            userRepository.setStatus(email, status);
        } else {
            throw new InvalidDataException("User status is invalid");
        }
    }

}

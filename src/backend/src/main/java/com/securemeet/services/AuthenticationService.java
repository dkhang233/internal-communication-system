package com.securemeet.services;

import java.time.LocalDateTime;
import java.util.Date;

import com.securemeet.exceptionhandlers.custom.InvalidDataException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.securemeet.dtos.user.LoginUserDto;
import com.securemeet.dtos.user.RegisterUserDto;
import com.securemeet.models.user.User;
import com.securemeet.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    // Đăng kí
    public void signup(RegisterUserDto input) {
        if (userRepository.findByEmail(input.getEmail()).isPresent()) {
            throw new InvalidDataException("Email has been used");
        }
        User user = User
                .builder()
                .email(input.getEmail())
                .role(input.getRole())
                .password(passwordEncoder.encode(input.getPassword()))
                .username(input.getUsername())
                .avatar("")
                .build();
        userRepository.save(user);
    }

    // Xác thực khi người dùng đăng nhập
    public User authenticate(LoginUserDto loginUserDto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginUserDto.getEmail(), loginUserDto.getPassword()));

        // Cập nhập thời gian lần cuối đăng nhập
        userRepository.setLastLoginTime(loginUserDto.getEmail(), LocalDateTime.now());

        return userRepository.findByEmail(loginUserDto.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Not found user"));
    }

}

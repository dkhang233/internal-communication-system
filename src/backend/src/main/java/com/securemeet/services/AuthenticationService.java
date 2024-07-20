package com.securemeet.services;

import java.util.Date;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.securemeet.dtos.user.LoginUserDto;
import com.securemeet.dtos.user.RegisterUserDto;
import com.securemeet.models.user.User;
import com.securemeet.repositories.UserRepository;
import com.securemeet.responses.user.UserInfor;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    // Đăng kí
    public User signup(RegisterUserDto input) {
        if (userRepository.findByEmail(input.getEmail()).isPresent()) {
            throw new RuntimeException("Email has been used");
        }
        User user = User
                .builder()
                .email(input.getEmail())
                .role(input.getRole().getValue())
                .password(passwordEncoder.encode(input.getPassword()))
                .username(input.getUsername())
                .build();
        return userRepository.save(user);
    }

    // Xác thực khi người dùng đăng nhập
    public User authenticate(LoginUserDto loginUserDto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginUserDto.getEmail(), loginUserDto.getPassword()));

        // Cập nhập thời gian lần cuối đăng nhập
        userRepository.setLastLoginTime(loginUserDto.getEmail(), new Date());

        return userRepository.findByEmail(loginUserDto.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Not found user"));
    }

    // Lấy thông tin người dùng hiện tại
    public UserInfor getUserInfor(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Not found user"));
        int[] roles = { user.getRole() };
        return UserInfor.builder().email(user.getUsername()).username(user.getName()).roles(roles).build();
    }
}

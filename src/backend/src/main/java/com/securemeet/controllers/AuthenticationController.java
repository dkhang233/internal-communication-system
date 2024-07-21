package com.securemeet.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.securemeet.dtos.user.LoginUserDto;
import com.securemeet.dtos.user.RegisterUserDto;
import com.securemeet.models.user.User;
import com.securemeet.responses.ApiResponseData;
import com.securemeet.responses.user.LoginResponse;
import com.securemeet.responses.user.UserInfo;
import com.securemeet.services.AuthenticationService;
import com.securemeet.services.JwtService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("${api.prefix}/users")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "**")
public class AuthenticationController {

    @Value("${api.prefix}")
    private String apiPrefix;
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    @PostMapping("/signup")
    public ApiResponseData<String> register(@RequestBody RegisterUserDto user) {
        authenticationService.signup(user);
        ApiResponseData<String> response = new ApiResponseData<>(0, "", "");
        return response;
    }

    @PostMapping("login")
    public ApiResponseData<LoginResponse> login(@RequestBody LoginUserDto user) {
        User authenticatedUser = authenticationService.authenticate(user);
        String jwtToken = jwtService.generateToken(authenticatedUser);
        ApiResponseData<LoginResponse> response = new ApiResponseData<>(0, new LoginResponse(jwtToken), "");
        return response;
    }

    @GetMapping("code")
    public ApiResponseData<String> getCode() {
        ApiResponseData<String> response = new ApiResponseData<>(0, "abc", "");
        return response;
    }

    @GetMapping("info")
    public ApiResponseData<UserInfo> getUserInfo(Authentication authentication) {
        UserInfo info = authenticationService.getUserInfo(authentication);
        ApiResponseData<UserInfo> response = new ApiResponseData<>(0, info, "");
        return response;
    }

}

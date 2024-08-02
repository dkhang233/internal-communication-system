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
@RequestMapping("${api.prefix}/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    @PostMapping("/signup")
    public ApiResponseData<String> register(@RequestBody RegisterUserDto user) {
        authenticationService.signup(user);
        return ApiResponseData.success("");
    }

    @PostMapping("/login")
    public ApiResponseData<LoginResponse> login(@RequestBody LoginUserDto user) {
        User authenticatedUser = authenticationService.authenticate(user);
        String jwtToken = jwtService.generateToken(authenticatedUser);
        return  ApiResponseData.success(new LoginResponse(jwtToken));
    }

    @GetMapping("/code")
    public ApiResponseData<String> getCode() {
        return  ApiResponseData.success("abc");
    }
}

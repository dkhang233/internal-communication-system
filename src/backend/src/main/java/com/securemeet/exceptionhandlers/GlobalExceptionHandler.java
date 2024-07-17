package com.securemeet.exceptionhandlers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.securemeet.responses.ApiResponseData;

import io.jsonwebtoken.ExpiredJwtException;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Xử lí các exception liên quan đến NOT_FOUND
    @ExceptionHandler({ UsernameNotFoundException.class })
    public ResponseEntity<ApiResponseData<String>> handleNotFoundException(UsernameNotFoundException ex) {
        ApiResponseData<String> response = new ApiResponseData<>(HttpStatus.NOT_FOUND.value(), "", ex.getMessage());
        return new ResponseEntity<ApiResponseData<String>>(response, HttpStatus.NOT_FOUND);
    }

    // Xử lí các exception liên quan đến BAD_REQUEST
    @ExceptionHandler({ InvalidDataException.class })
    public ResponseEntity<ApiResponseData<String>> handleBadRequestException(ExpiredJwtException ex) {
        ApiResponseData<String> response = new ApiResponseData<>(HttpStatus.BAD_REQUEST.value(), "", ex.getMessage());
        return new ResponseEntity<ApiResponseData<String>>(response, HttpStatus.BAD_REQUEST);
    }

    // Xử lí các exception liên quan đến UNAUTHORIZED
    @ExceptionHandler({ ExpiredJwtException.class })
    public ResponseEntity<ApiResponseData<String>> handleUnauthorizedException(ExpiredJwtException ex) {
        ApiResponseData<String> response = new ApiResponseData<>(HttpStatus.UNAUTHORIZED.value(), "", ex.getMessage());
        return new ResponseEntity<ApiResponseData<String>>(response, HttpStatus.UNAUTHORIZED);
    }

    // Xử lí exception không thuộc các loại ở trên
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseData<String>> handleException(Exception ex) {
        ApiResponseData<String> response = new ApiResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "",
                ex.getMessage());
        return new ResponseEntity<ApiResponseData<String>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

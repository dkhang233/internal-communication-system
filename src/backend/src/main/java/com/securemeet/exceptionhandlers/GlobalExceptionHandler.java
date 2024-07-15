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

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseData<String>> handleException(Exception ex) {
        ApiResponseData<String> response = new ApiResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "",
                ex.getMessage());
        return new ResponseEntity<ApiResponseData<String>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponseData<String>> handleUserNotFoundException(UsernameNotFoundException ex) {
        ApiResponseData<String> response = new ApiResponseData<>(HttpStatus.NOT_FOUND.value(), "", ex.getMessage());
        return new ResponseEntity<ApiResponseData<String>>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({ ExpiredJwtException.class, InvalidDataException.class })
    public ResponseEntity<ApiResponseData<String>> handleBadRequestException(ExpiredJwtException ex) {
        ApiResponseData<String> response = new ApiResponseData<>(HttpStatus.BAD_REQUEST.value(), "", ex.getMessage());
        return new ResponseEntity<ApiResponseData<String>>(response, HttpStatus.BAD_REQUEST);
    }

}

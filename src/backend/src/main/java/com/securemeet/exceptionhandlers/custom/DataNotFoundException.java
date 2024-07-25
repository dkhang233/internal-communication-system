package com.securemeet.exceptionhandlers.custom;

public class DataNotFoundException extends RuntimeException {
    public DataNotFoundException(String message) {
        super(message);
    }
}

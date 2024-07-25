package com.securemeet.exceptionhandlers.custom;

public class InvalidDataException extends RuntimeException {
    public InvalidDataException(String message) {
        super(message);
    }
}

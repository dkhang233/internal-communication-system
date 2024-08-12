package com.securemeet.dtos.message;

import java.time.ZonedDateTime;

import com.securemeet.enums.MessageType;

import lombok.Data;

@Data
public class MessageDto {
    private String sender;
    private String recipient;
    private MessageType type;
    private String content;
}

package com.securemeet.dtos.message;

import java.util.Date;

import com.securemeet.enums.MessageType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageDto {
    private String sender;
    private String recipient;
    private MessageType type;
    private String content;
    private Date sendedAt;
}

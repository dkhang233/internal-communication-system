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

    public void setType(int value) {
        switch (value) {
            case 0:
                this.type = MessageType.TEXT;
                break;
            case 1:
                this.type = MessageType.LINK;
                break;
            case 2:
                this.type = MessageType.IMAGE;
                break;
            case 3:
                this.type = MessageType.AUDIO;
                break;
            case 4:
                this.type = MessageType.VIDEO;
                break;
            case 5:
                this.type = MessageType.FILE;
                break;
            default:
                throw new RuntimeException("Message type not found");
        }
    }
}

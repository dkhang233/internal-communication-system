package com.securemeet.responses.message;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponse {
    private int id;

    private String sender;

    private String recipient;

    private int type;

    private String content;

    private LocalDateTime sendedAt;

    private String senderUsername;

    private String recipientUsername;
}

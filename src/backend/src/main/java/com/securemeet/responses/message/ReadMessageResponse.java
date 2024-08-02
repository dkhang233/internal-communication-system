package com.securemeet.responses.message;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ReadMessageResponse {
    private  String contactId;
    private int lastMessageId;
    private int quantity;
}

package com.securemeet.responses.user;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContactResponse {
    private String ownerId;
    private String contactId;
    private String contactUsername;
    private int status;
    private  String avatar;
    private LocalDateTime contactTime;
}

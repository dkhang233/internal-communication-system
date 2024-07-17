package com.securemeet.responses.user;

import java.sql.Date;

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
    private Date contactTime;
}

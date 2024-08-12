package com.securemeet.models.message;

import java.time.LocalDateTime;
import java.util.Date;

import com.securemeet.enums.MessageStatus;
import com.securemeet.enums.MessageType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "message")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "sender")
    private String sender;

    @Column(name = "recipient")
    private String recipient;

    @Column(name = "type")
    private MessageType type;

    @Column(name = "content")
    private String content;

    @Column(name = "sended_at")
    private LocalDateTime sendedAt;

    @Column(name="status")
    private MessageStatus status;
}

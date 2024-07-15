package com.securemeet.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.securemeet.models.message.Message;
import com.securemeet.responses.message.MessageResponse;

public interface MessageRepository extends JpaRepository<Message, Integer> {

    @Query(value = "SELECT new com.securemeet.responses.message.MessageResponse(m.id, m.sender, m.recipient, m.type, m.content, m.sendedAt, a.username, b.username) "
            +
            "FROM Message m " +
            "JOIN User a ON m.sender = a.email " +
            "JOIN User b ON m.recipient = b.email")
    List<MessageResponse> getAllMessages();

    @Query(value = "SELECT m FROM Message m WHERE m.sender IN (:myId,:id) AND m.recipient IN (:myId,:id) ORDER BY m.sendedAt DESC LIMIT 10")
    List<Message> getMessagesForSpecificUser(@Param(value = "myId") String myId, @Param(value = "id") String id);
}

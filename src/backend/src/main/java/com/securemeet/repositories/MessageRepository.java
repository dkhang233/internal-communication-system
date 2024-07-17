package com.securemeet.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.securemeet.models.message.Message;

public interface MessageRepository extends JpaRepository<Message, Integer> {
        @Query(value = "SELECT m FROM Message m " +
                        "WHERE m.sender IN (:myId,:contactId) AND m.recipient IN (:myId,:contactId) " +
                        "ORDER BY m.sendedAt DESC LIMIT 20")
        List<Message> getMessagesForSpecificContact(@Param(value = "myId") String myId,
                        @Param(value = "contactId") String id);
}

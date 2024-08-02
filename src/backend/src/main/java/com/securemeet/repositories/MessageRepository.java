package com.securemeet.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import com.securemeet.models.message.Message;
import org.springframework.transaction.annotation.Transactional;

public interface MessageRepository extends JpaRepository<Message, Integer> , PagingAndSortingRepository<Message,Integer>
 {
        @Query(value = "SELECT m FROM Message m " +
                "WHERE (m.sender = :myId AND m.recipient = :contactId) " +
                "OR (m.sender = :contactId AND m.recipient = :myId) " +
                "ORDER BY m.sendedAt DESC")
        Page<Message> getMessagesForSpecificContact(@Param(value = "myId") String myId,
                                                    @Param(value = "contactId") String id,Pageable pageable);
        @Modifying
        @Transactional
        @Query(value = "UPDATE message m SET m.status = 3 " +
                "WHERE m.sender = :contactId AND m.recipient = :ownerId  AND m.id <= :lastMessageId " +
                "ORDER BY m.id DESC LIMIT :quantity",nativeQuery = true)
        void updateReadMessageStatus(String ownerId, String contactId, int lastMessageId, int quantity);

         @Query(value = "SELECT m FROM Message m " +
                 "WHERE m.sender = :myId OR m.recipient = :myId " +
                 "ORDER BY m.sendedAt DESC")
         Page<Message> getMessages(String myId, Pageable pageable);
 }

package com.securemeet.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.securemeet.models.user.Contact;
import com.securemeet.responses.user.ContactResponse;

public interface ContactRepository extends JpaRepository<Contact, Integer> {
    @Query(value = "SELECT new com.securemeet.responses.user.ContactResponse(c.ownerId, c.contactId, b.username, b.status, c.contactTime) FROM Contact c JOIN User b on c.contactId = b.email WHERE c.ownerId = :ownerId")
    List<ContactResponse> findByOwnerId(String ownerId);

    @Query(value = "SELECT new com.securemeet.responses.user.ContactResponse(c.ownerId, c.contactId, b.username, b.status, c.contactTime) FROM Contact c JOIN User b ON c.contactId = b.email WHERE c.ownerId = :ownerId AND c.contactId = :contactId")
    Optional<ContactResponse> findByOwnerIdAndContactId(String ownerId, String contactId);
}

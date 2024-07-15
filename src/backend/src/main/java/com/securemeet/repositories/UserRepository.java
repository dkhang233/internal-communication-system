package com.securemeet.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.securemeet.models.user.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);

    @Query(value = "UPDATE User u SET u.status = :status WHERE u.email = :email")
    void setStatus(@Param("email") String email, @Param("status") int status);
}

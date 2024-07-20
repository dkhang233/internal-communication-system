package com.securemeet.repositories;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.securemeet.models.user.User;
import com.securemeet.responses.user.UserInfor;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "UPDATE User u SET u.status = :status WHERE u.email = :email")
    void setStatus(@Param("email") String email, @Param("status") int status);

    @Modifying
    @Transactional
    @Query(value = "UPDATE User u SET u.lastLoginTime = :lastLoginTime WHERE u.email = :email")
    void setLastLoginTime(@Param("email") String email, @Param("lastLoginTime") Date lastLoginTime);

    @Query(value = "SELECT new com.securemeet.responses.user.UserInfor(u.email, u.username, u.role, u.avatar, u.status) FROM User u WHERE u.email LIKE :keyword OR u.username LIKE :keyword")
    List<UserInfor> searchUser(String keyword);
}

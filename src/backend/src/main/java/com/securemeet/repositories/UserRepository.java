package com.securemeet.repositories;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.securemeet.models.user.User;
import com.securemeet.responses.user.UserInfo;

@Repository
public interface UserRepository extends PagingAndSortingRepository<User, String>, JpaRepository<User,String> {
    Optional<User> findByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "UPDATE User u SET u.status = :status WHERE u.email = :email")
    void setStatus(@Param("email") String email, @Param("status") int status);

    @Modifying
    @Transactional
    @Query(value = "UPDATE User u SET u.lastLoginTime = :lastLoginTime WHERE u.email = :email")
    void setLastLoginTime(@Param("email") String email, @Param("lastLoginTime") LocalDateTime lastLoginTime);

    @Query(value = "SELECT new com.securemeet.responses.user.UserInfo(u.email, u.username, u.role, u.avatar, u.status) FROM User u WHERE u.email LIKE :keyword OR u.username LIKE :keyword")
    Page<UserInfo> searchUser(String keyword, Pageable pageable);
}

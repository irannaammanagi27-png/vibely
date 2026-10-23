
package com.vibely.vibely_backend.repository;

import com.vibely.vibely_backend.Entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("""
        SELECT m FROM Message m
        JOIN FETCH m.sender
        JOIN FETCH m.receiver
        WHERE
          (m.sender.id = :userId AND m.receiver.id = :otherUserId)
          OR
          (m.sender.id = :otherUserId AND m.receiver.id = :userId)
        ORDER BY m.sentAt ASC, m.id ASC
        """)
    List<Message> findConversation(
            @Param("userId") Long userId,
            @Param("otherUserId") Long otherUserId);
}

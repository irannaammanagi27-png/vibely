
package com.vibely.vibely_backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vibely.vibely_backend.Entity.FriendRequest;
import com.vibely.vibely_backend.Entity.FriendRequestStatus;

import java.util.List;
import java.util.Optional;

public interface FriendRequestRepository
        extends JpaRepository<FriendRequest, Long> {

    Optional<FriendRequest> findBySender_IdAndReceiver_Id(
            Long senderId, Long receiverId);

    List<FriendRequest> findByReceiver_IdAndStatusOrderByCreatedAtDesc(
            Long receiverId, FriendRequestStatus status);

    List<FriendRequest> findBySender_IdAndStatusOrderByCreatedAtDesc(
            Long senderId, FriendRequestStatus status);

    @Query("""
        SELECT fr FROM FriendRequest fr
        JOIN FETCH fr.sender
        JOIN FETCH fr.receiver
        WHERE fr.status = :status
          AND (fr.sender.id = :userId OR fr.receiver.id = :userId)
        ORDER BY fr.createdAt DESC
        """)
    List<FriendRequest> findConnections(
            @Param("userId") Long userId,
            @Param("status") FriendRequestStatus status);
}

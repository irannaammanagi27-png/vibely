
package com.vibely.vibely_backend.dto;

import java.time.LocalDateTime;

import com.vibely.vibely_backend.Entity.FriendRequest;

public class FriendRequestResponse {

    private Long id;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String receiverName;
    private String status;
    private LocalDateTime createdAt;

    public FriendRequestResponse(FriendRequest request) {
        this.id = request.getId();
        this.senderId = request.getSender().getId();
        this.senderName = request.getSender().getFullName();
        this.receiverId = request.getReceiver().getId();
        this.receiverName = request.getReceiver().getFullName();
        this.status = request.getStatus().name();
        this.createdAt = request.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public Long getSenderId() {
        return senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}

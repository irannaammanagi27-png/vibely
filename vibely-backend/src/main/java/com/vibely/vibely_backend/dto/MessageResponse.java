
package com.vibely.vibely_backend.dto;

import com.vibely.vibely_backend.Entity.Message;
import java.time.LocalDateTime;

public record MessageResponse(
        Long id,
        Long senderId,
        String senderName,
        Long receiverId,
        String receiverName,
        String content,
        LocalDateTime sentAt) {

    public MessageResponse(Message message) {
        this(
            message.getId(),
            message.getSender().getId(),
            message.getSender().getFullName(),
            message.getReceiver().getId(),
            message.getReceiver().getFullName(),
            message.getContent(),
            message.getSentAt()
        );
    }
}

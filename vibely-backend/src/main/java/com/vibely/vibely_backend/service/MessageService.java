
package com.vibely.vibely_backend.service;

import com.vibely.vibely_backend.Entity.FriendRequestStatus;
import com.vibely.vibely_backend.Entity.Message;
import com.vibely.vibely_backend.Entity.User;
import com.vibely.vibely_backend.dto.MessageResponse;
import com.vibely.vibely_backend.repository.FriendRequestRepository;
import com.vibely.vibely_backend.repository.MessageRepository;
import com.vibely.vibely_backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final FriendRequestRepository friendRequestRepository;

    public MessageService(
            MessageRepository messageRepository,
            UserRepository userRepository,
            FriendRequestRepository friendRequestRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.friendRequestRepository = friendRequestRepository;
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));
    }

    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));
    }

    private void verifyFriends(Long firstId, Long secondId) {
        boolean friends =
                friendRequestRepository
                    .findBySender_IdAndReceiver_Id(firstId, secondId)
                    .filter(r -> r.getStatus() == FriendRequestStatus.ACCEPTED)
                    .isPresent()
                ||
                friendRequestRepository
                    .findBySender_IdAndReceiver_Id(secondId, firstId)
                    .filter(r -> r.getStatus() == FriendRequestStatus.ACCEPTED)
                    .isPresent();

        if (!friends) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can message only accepted friends");
        }
    }

    @Transactional
    public MessageResponse sendMessage(
            String email, Long receiverId, String content) {

        if (content == null || content.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Message cannot be empty");
        }

        if (content.length() > 2000) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Message cannot exceed 2000 characters");
        }

        User sender = findUserByEmail(email);
        User receiver = findUserById(receiverId);

        if (sender.getId().equals(receiver.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You cannot message yourself");
        }

        verifyFriends(sender.getId(), receiver.getId());

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content.trim());

        return new MessageResponse(messageRepository.save(message));
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getConversation(
            String email, Long otherUserId) {

        User currentUser = findUserByEmail(email);
        User otherUser = findUserById(otherUserId);

        if (currentUser.getId().equals(otherUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You cannot open a conversation with yourself");
        }

        verifyFriends(currentUser.getId(), otherUser.getId());

        return messageRepository
                .findConversation(currentUser.getId(), otherUser.getId())
                .stream()
                .map(MessageResponse::new)
                .toList();
    }
}

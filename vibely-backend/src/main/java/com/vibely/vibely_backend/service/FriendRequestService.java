
package com.vibely.vibely_backend.service;

import com.vibely.vibely_backend.Entity.FriendRequest;
import com.vibely.vibely_backend.Entity.FriendRequestStatus;
import com.vibely.vibely_backend.Entity.User;
import com.vibely.vibely_backend.dto.FriendRequestResponse;
import com.vibely.vibely_backend.repository.FriendRequestRepository;
import com.vibely.vibely_backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FriendRequestService {

    private final FriendRequestRepository requestRepository;
    private final UserRepository userRepository;

    public FriendRequestService(
            FriendRequestRepository requestRepository,
            UserRepository userRepository) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));
    }

    private User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));
    }

    @Transactional
    public FriendRequestResponse sendRequest(String email, Long receiverId) {
        User sender = getUserByEmail(email);
        User receiver = getUserById(receiverId);

        if (sender.getId().equals(receiver.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You cannot send a friend request to yourself");
        }

        var existing = requestRepository.findBySender_IdAndReceiver_Id(
                sender.getId(), receiver.getId());

        if (existing.isPresent()) {
            FriendRequest request = existing.get();

            if (request.getStatus() == FriendRequestStatus.PENDING) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT, "Friend request already sent");
            }

            if (request.getStatus() == FriendRequestStatus.ACCEPTED) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT, "You are already friends");
            }

            // Allow the sender to retry a previously rejected request.
            request.setStatus(FriendRequestStatus.PENDING);
            return new FriendRequestResponse(
                    requestRepository.save(request));
        }

        var reverse = requestRepository.findBySender_IdAndReceiver_Id(
                receiver.getId(), sender.getId());

        if (reverse.isPresent()) {
            FriendRequest request = reverse.get();

            if (request.getStatus() == FriendRequestStatus.PENDING) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "This user has already sent you a request");
            }

            if (request.getStatus() == FriendRequestStatus.ACCEPTED) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT, "You are already friends");
            }
        }

        FriendRequest request = new FriendRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setStatus(FriendRequestStatus.PENDING);

        return new FriendRequestResponse(requestRepository.save(request));
    }

    @Transactional(readOnly = true)
    public List<FriendRequestResponse> getIncoming(String email) {
        User user = getUserByEmail(email);

        return requestRepository
                .findByReceiver_IdAndStatusOrderByCreatedAtDesc(
                        user.getId(), FriendRequestStatus.PENDING)
                .stream()
                .map(FriendRequestResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FriendRequestResponse> getOutgoing(String email) {
        User user = getUserByEmail(email);

        return requestRepository
                .findBySender_IdAndStatusOrderByCreatedAtDesc(
                        user.getId(), FriendRequestStatus.PENDING)
                .stream()
                .map(FriendRequestResponse::new)
                .toList();
    }

    @Transactional
    public FriendRequestResponse acceptRequest(
            String email, Long requestId) {
        User user = getUserByEmail(email);
        FriendRequest request = getRequest(requestId);

        if (!request.getReceiver().getId().equals(user.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only the recipient can accept this request");
        }

        if (request.getStatus() != FriendRequestStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This request is no longer pending");
        }

        request.setStatus(FriendRequestStatus.ACCEPTED);
        return new FriendRequestResponse(requestRepository.save(request));
    }

    @Transactional
    public FriendRequestResponse rejectRequest(
            String email, Long requestId) {
        User user = getUserByEmail(email);
        FriendRequest request = getRequest(requestId);

        if (!request.getReceiver().getId().equals(user.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only the recipient can reject this request");
        }

        if (request.getStatus() != FriendRequestStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This request is no longer pending");
        }

        request.setStatus(FriendRequestStatus.REJECTED);
        return new FriendRequestResponse(requestRepository.save(request));
    }

    @Transactional(readOnly = true)
    public List<FriendRequestResponse> getFriends(String email) {
        User user = getUserByEmail(email);

        return requestRepository.findConnections(
                        user.getId(), FriendRequestStatus.ACCEPTED)
                .stream()
                .map(FriendRequestResponse::new)
                .toList();
    }

    private FriendRequest getRequest(Long requestId) {
        return requestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Friend request not found"));
    }
}

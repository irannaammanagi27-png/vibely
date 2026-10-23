
package com.vibely.vibely_backend.controller;

import com.vibely.vibely_backend.dto.FriendRequestResponse;
import com.vibely.vibely_backend.service.FriendRequestService;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friend-requests")
public class FriendRequestController {

    private final FriendRequestService friendRequestService;

    public FriendRequestController(
            FriendRequestService friendRequestService) {
        this.friendRequestService = friendRequestService;
    }

    @PostMapping("/{receiverId}")
    @ResponseStatus(HttpStatus.CREATED)
    public FriendRequestResponse sendRequest(
            Authentication authentication,
            @PathVariable Long receiverId) {
        return friendRequestService.sendRequest(
                authentication.getName(), receiverId);
    }

    @GetMapping("/incoming")
    public List<FriendRequestResponse> getIncoming(
            Authentication authentication) {
        return friendRequestService.getIncoming(
                authentication.getName());
    }

    @GetMapping("/outgoing")
    public List<FriendRequestResponse> getOutgoing(
            Authentication authentication) {
        return friendRequestService.getOutgoing(
                authentication.getName());
    }

    @GetMapping("/friends")
    public List<FriendRequestResponse> getFriends(
            Authentication authentication) {
        return friendRequestService.getFriends(
                authentication.getName());
    }

    @PutMapping("/{requestId}/accept")
    public FriendRequestResponse acceptRequest(
            Authentication authentication,
            @PathVariable Long requestId) {
        return friendRequestService.acceptRequest(
                authentication.getName(), requestId);
    }

    @PutMapping("/{requestId}/reject")
    public FriendRequestResponse rejectRequest(
            Authentication authentication,
            @PathVariable Long requestId) {
        return friendRequestService.rejectRequest(
                authentication.getName(), requestId);
    }
}


package com.vibely.vibely_backend.controller;

import com.vibely.vibely_backend.dto.MessageResponse;
import com.vibely.vibely_backend.service.MessageService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    public record SendMessageRequest(
            @NotBlank(message = "Message cannot be empty")
            @Size(max = 2000, message = "Message cannot exceed 2000 characters")
            String content) {
    }

    @GetMapping("/{otherUserId}")
    public List<MessageResponse> getConversation(
            Authentication authentication,
            @PathVariable Long otherUserId) {
        return messageService.getConversation(
                authentication.getName(), otherUserId);
    }

    @PostMapping("/{receiverId}")
    @ResponseStatus(HttpStatus.CREATED)
    public MessageResponse sendMessage(
            Authentication authentication,
            @PathVariable Long receiverId,
            @Valid @RequestBody SendMessageRequest request) {
        return messageService.sendMessage(
                authentication.getName(),
                receiverId,
                request.content());
    }
}

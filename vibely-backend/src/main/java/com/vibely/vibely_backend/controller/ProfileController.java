
package com.vibely.vibely_backend.controller;

import com.vibely.vibely_backend.dto.ProfileResponse;
import com.vibely.vibely_backend.dto.UpdateProfileRequest;
import com.vibely.vibely_backend.service.ProfileService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<List<ProfileResponse>> discoverUsers(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                profileService.discoverUsers(email)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(
            Authentication authentication) {

        try {
            return ResponseEntity.ok(
                    profileService.getMyProfile(authentication.getName())
            );
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", exception.getMessage()));
        }
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {

        try {
            return ResponseEntity.ok(
                    profileService.updateMyProfile(
                            authentication.getName(),
                            request
                    )
            );
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", exception.getMessage()));
        }
    }
}

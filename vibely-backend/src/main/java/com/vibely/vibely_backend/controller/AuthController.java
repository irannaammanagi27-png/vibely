package com.vibely.vibely_backend.controller;

import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vibely.vibely_backend.Entity.User;
import com.vibely.vibely_backend.dto.LoginRequest;
import com.vibely.vibely_backend.dto.RegisterRequest;
import com.vibely.vibely_backend.security.JwtService;
import com.vibely.vibely_backend.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        try {
            User user = userService.register(request);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "message", "Registration successful",
                            "id", user.getId(),
                            "fullName", user.getFullName(),
                            "email", user.getEmail()
                    )
            );
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", exception.getMessage()));
        }
    }

@PostMapping("/login")
public ResponseEntity<?> login( @Valid @RequestBody LoginRequest request) {

    try {
        User user = userService.login(
                request.getEmail(),
                request.getPassword());
        String token = jwtService.generateToken(user.getEmail());

        return ResponseEntity.ok(
            Map.of(
                "message", "Login successful",
                "token", token,
                "id", user.getId(),
                "fullName", user.getFullName(),
                "email", user.getEmail()
            )
        );

    } catch (IllegalArgumentException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                Map.of("message", exception.getMessage()));
    }
}

@GetMapping("/me")
public ResponseEntity<?> me(Authentication authentication) {
    return ResponseEntity.ok(
        Map.of("email", authentication.getName())
    );
}

}

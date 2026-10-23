package com.vibely.vibely_backend.service;



import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vibely.vibely_backend.Entity.User;
import com.vibely.vibely_backend.dto.RegisterRequest;
import com.vibely.vibely_backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User register(RegisterRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "An account with this email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        if (request.getInterests() != null) {
            user.setInterests(
                    String.join(",", request.getInterests()));
        }

        return userRepository.save(user);
    }

public User login(String email, String password) {

    User user = userRepository
            .findByEmail(email.trim().toLowerCase())
            .orElseThrow(() ->
                    new IllegalArgumentException(
                            "Invalid email or password"));

    if (!passwordEncoder.matches(password, user.getPassword())) {
        throw new IllegalArgumentException(
                "Invalid email or password");
    }

    return user;
}

}


package com.vibely.vibely_backend.service;

import com.vibely.vibely_backend.Entity.User;
import com.vibely.vibely_backend.dto.ProfileResponse;
import com.vibely.vibely_backend.dto.UpdateProfileRequest;
import com.vibely.vibely_backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<ProfileResponse> discoverUsers(String email) {
        return userRepository.findAllByEmailNotOrderByFullNameAsc(email)
                .stream()
                .map(this::toProfileResponse)
                .collect(Collectors.toList());
    }

    public ProfileResponse getMyProfile(String email) {
        User user = findUser(email);
        return toProfileResponse(user);
    }

    @Transactional
    public ProfileResponse updateMyProfile(
            String email,
            UpdateProfileRequest request) {

        User user = findUser(email);

        user.setFullName(request.getFullName().trim());

        List<String> interests = request.getInterests() == null
                ? List.of()
                : request.getInterests().stream()
                    .filter(interest -> interest != null && !interest.isBlank())
                    .map(String::trim)
                    .distinct()
                    .limit(12)
                    .collect(Collectors.toList());

        user.setInterests(String.join(",", interests));

        User savedUser = userRepository.save(user);
        return toProfileResponse(savedUser);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                    new IllegalArgumentException("User account not found"));
    }

    private ProfileResponse toProfileResponse(User user) {
        List<String> interests = user.getInterests() == null
                || user.getInterests().isBlank()
                ? List.of()
                : Arrays.stream(user.getInterests().split(","))
                    .map(String::trim)
                    .filter(interest -> !interest.isEmpty())
                    .collect(Collectors.toList());

        return new ProfileResponse(
                user.getId(),
                user.getFullName(),
                interests,
                user.getCreatedAt()
        );
    }
}

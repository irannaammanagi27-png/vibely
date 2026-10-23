
package com.vibely.vibely_backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ProfileResponse {

    private Long id;
    private String fullName;
    private List<String> interests;
    private LocalDateTime createdAt;

    public ProfileResponse() {
    }

    public ProfileResponse(
            Long id,
            String fullName,
            List<String> interests,
            LocalDateTime createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.interests = interests;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public List<String> getInterests() {
        return interests;
    }

    public void setInterests(List<String> interests) {
        this.interests = interests;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

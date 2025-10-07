package com.bookhive.dto;

import com.bookhive.model.User;

public class AuthResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String token; // nullable for /auth/me

    public AuthResponse() { }

    public AuthResponse(Long id, String name, String email, String role, String token) {
        this.id = id; this.name = name; this.email = email; this.role = role; this.token = token;
    }

    public static AuthResponse from(User u, String token) {
        return new AuthResponse(u.getId(), u.getName(), u.getEmail(), u.getRole().name(), token);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}

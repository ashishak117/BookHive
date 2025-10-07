package com.bookhive.controller;

import com.bookhive.dto.*;
import com.bookhive.model.User;
import com.bookhive.security.JwtService;
import com.bookhive.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService users;
    private final JwtService jwt;
    private final AuthenticationManager authManager;

    public AuthController(UserService users, JwtService jwt, AuthenticationManager authManager) {
        this.users = users;
        this.jwt = jwt;
        this.authManager = authManager;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        User u = users.register(req);
        String token = jwt.generateToken(u.getEmail(), u.getRole().name(), u.getId());
        return ResponseEntity.ok(AuthResponse.from(u, token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );
            // Load our entity after successful auth:
            User u = users.findByEmail(req.getEmail());
            String token = jwt.generateToken(u.getEmail(), u.getRole().name(), u.getId());
            return ResponseEntity.ok(AuthResponse.from(u, token));
        } catch (Exception ex) {
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated())
            return ResponseEntity.status(401).build();
        // username is email
        String email = authentication.getName();
        User u = users.findByEmail(email);
        return ResponseEntity.ok(AuthResponse.from(u, null));
    }

    @GetMapping("/ping")
    public String ping() { return "ok"; }
}

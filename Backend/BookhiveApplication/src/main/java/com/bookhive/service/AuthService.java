package com.bookhive.service;

import com.bookhive.dto.LoginRequest;
import com.bookhive.dto.RegisterRequest;
import com.bookhive.model.User;
import com.bookhive.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserService userService;
    private final AuthenticationManager authManager;
    private final JwtService jwt;

    public AuthService(UserService userService,
                       AuthenticationManager authManager,
                       JwtService jwt) {
        this.userService = userService;
        this.authManager = authManager;
        this.jwt = jwt;
    }

    /** Delegates to UserService which handles DTO -> entity mapping (including Address). */
    public User register(RegisterRequest req) {
        return userService.register(req);
    }

    /** Authenticates credentials and returns a fresh JWT if valid. */
    public String login(LoginRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        // Load our domain entity after successful auth
        User u = userService.findByEmail(req.getEmail());
        return jwt.generateToken(u.getEmail(), u.getRole().name(), u.getId());
    }
}

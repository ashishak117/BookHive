package com.bookhive.service;

import com.bookhive.dto.RegisterRequest;
import com.bookhive.model.Address;
import com.bookhive.model.Role;
import com.bookhive.model.User;
import com.bookhive.repo.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public User register(RegisterRequest req) {
        if (repo.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User u = new User();
        u.setName(req.getName());
        u.setEmail(req.getEmail());
        u.setPhone(req.getPhone());
        u.setRole(Role.USER);
        u.setPassword(encoder.encode(req.getPassword()));

        if (req.getAddress() != null && req.getAddress().getLine() != null) {
            u.setAddress(new Address(req.getAddress().getLine()));
        }

        return repo.save(u);
    }

    public User findByEmail(String email) {
        return repo.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}

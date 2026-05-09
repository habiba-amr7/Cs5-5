package com.example.movies.controller;

import com.example.movies.dto.RegisterRequest;
import com.example.movies.model.AppUser;
import com.example.movies.repository.AppUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AppUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
        }

        AppUser user = new AppUser(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                "USER"
        );
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication authentication) {
        Map<String, Object> result = new HashMap<>();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            result.put("loggedIn", false);
            return result;
        }

        String role = authentication.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        result.put("loggedIn", true);
        result.put("username", authentication.getName());
        result.put("role", role);
        return result;
    }
}

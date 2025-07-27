package com.ecommerce.controller;

import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);
            String email = jwtUtil.extractUsername(token);
            
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                Map<String, Object> response = new HashMap<>();
                response.put("email", user.getEmail());
                response.put("firstName", user.getFirstName());
                response.put("lastName", user.getLastName());
                response.put("role", user.getRole().name());
                response.put("dateCreated", user.getDateCreated());
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"Invalid token\"}");
        }
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> updateData, HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);
            String email = jwtUtil.extractUsername(token);
            
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                // Update basic information
                if (updateData.containsKey("firstName")) {
                    user.setFirstName((String) updateData.get("firstName"));
                }
                if (updateData.containsKey("lastName")) {
                    user.setLastName((String) updateData.get("lastName"));
                }
                if (updateData.containsKey("email")) {
                    String newEmail = (String) updateData.get("email");
                    // Check if email is already taken by another user
                    Optional<User> existingUser = userRepository.findByEmail(newEmail);
                    if (existingUser.isPresent() && !existingUser.get().getId().equals(user.getId())) {
                        return ResponseEntity.badRequest().body("{\"error\": \"Email already exists\"}");
                    }
                    user.setEmail(newEmail);
                }
                
                // Update password if provided
                if (updateData.containsKey("newPassword") && updateData.containsKey("currentPassword")) {
                    String currentPassword = (String) updateData.get("currentPassword");
                    String newPassword = (String) updateData.get("newPassword");
                    
                    if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                        return ResponseEntity.badRequest().body("{\"error\": \"Current password is incorrect\"}");
                    }
                    
                    user.setPassword(passwordEncoder.encode(newPassword));
                }
                
                User updatedUser = userRepository.save(user);
                
                Map<String, Object> response = new HashMap<>();
                response.put("email", updatedUser.getEmail());
                response.put("firstName", updatedUser.getFirstName());
                response.put("lastName", updatedUser.getLastName());
                response.put("role", updatedUser.getRole().name());
                response.put("message", "Profile updated successfully");
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"Failed to update profile\"}");
        }
    }

    @DeleteMapping("/account")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteAccount(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        try {
            String token = extractTokenFromRequest(httpRequest);
            String email = jwtUtil.extractUsername(token);
            String password = request.get("password");
            
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                if (!passwordEncoder.matches(password, user.getPassword())) {
                    return ResponseEntity.badRequest().body("{\"error\": \"Password is incorrect\"}");
                }
                
                userRepository.delete(user);
                return ResponseEntity.ok().body("{\"message\": \"Account deleted successfully\"}");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"Failed to delete account\"}");
        }
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        throw new RuntimeException("Token not found");
    }
}

package com.budget.auth.controllers;

import com.budget.auth.dto.UpdateUserDTO;
import com.budget.auth.models.User;
import com.budget.auth.services.UserService;
import jakarta.validation.Valid;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    @PutMapping("/{id}")
    public ResponseEntity<User> update(
            @PathVariable Integer id,
            @RequestBody @Valid UpdateUserDTO user) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        if (!currentUser.getId().equals(id)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        User existingUser = this.userService.findById(currentUser.getId()).orElse(null);
        if (existingUser == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        this.userService.update(user, existingUser);
        return new ResponseEntity<>(existingUser, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!userService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        if (!currentUser.getId().equals(id)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

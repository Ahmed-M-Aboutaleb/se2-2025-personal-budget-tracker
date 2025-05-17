package com.budget.auth.controllers;

import com.budget.auth.dto.LoginResponse;
import com.budget.auth.dto.LoginUserRequestDTO;
import com.budget.auth.dto.NewUserRequestDTO;
import com.budget.auth.models.User;
import com.budget.auth.services.AuthService;
import com.budget.auth.services.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @Autowired
    private JwtService jwtService;
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody @Valid NewUserRequestDTO user) {
        User saved = authService.registerUser(user);
        return ResponseEntity
                .created(URI.create("/api/users/" + saved.getId()))
                .body(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginUserRequestDTO user) {
        User saved = authService.login(user);
        String token = jwtService.generateToken(saved);
        LoginResponse loginResponse = new LoginResponse(token, saved);
        return ResponseEntity.ok(loginResponse);

    }

    @GetMapping("/me")
    public ResponseEntity<User> getUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        return ResponseEntity.ok(currentUser);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError)error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }
}

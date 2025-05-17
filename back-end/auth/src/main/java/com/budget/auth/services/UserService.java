package com.budget.auth.services;

import com.budget.auth.dto.UpdateUserDTO;
import com.budget.auth.models.User;
import com.budget.auth.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User save(final User user) {
        return userRepository.save(user);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(final Integer id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(final String email) {
        return userRepository.findByEmail(email);
    }

    public User update(final UpdateUserDTO user, final User existingUser) {
        existingUser.setFirst_name(user.getFirst_name());
        existingUser.setLast_name(user.getLast_name());
        String hashed = passwordEncoder.encode(user.getPassword());
        existingUser.setPassword(hashed);
        return userRepository.save(existingUser);
    }

    public void deleteById(final Integer id) {
        userRepository.deleteById(id);
    }
}

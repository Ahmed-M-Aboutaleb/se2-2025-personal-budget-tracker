package com.budget.auth.services;

import com.budget.auth.dto.LoginUserRequestDTO;
import com.budget.auth.dto.NewUserRequestDTO;
import com.budget.auth.mappers.UserDTOMapper;
import com.budget.auth.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    UserDTOMapper userDTOMapper;

    public User registerUser(NewUserRequestDTO dto) {
        User user = userDTOMapper.mapUserRequestDTOToUser(dto);
        String hashed = passwordEncoder.encode(dto.getPassword());
        user.setPassword(hashed);
        return userService.save(user);
    }

    public User login(LoginUserRequestDTO requestDTO) {
        Optional<User> user = userService.findByEmail(requestDTO.getEmail());
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(requestDTO.getEmail(), requestDTO.getPassword()));
//        if(passwordEncoder.matches(requestDTO.getPassword(), user.get().getPassword()))
//            return "success";
//        return "fail";
        return user.orElse(null);
    }
}

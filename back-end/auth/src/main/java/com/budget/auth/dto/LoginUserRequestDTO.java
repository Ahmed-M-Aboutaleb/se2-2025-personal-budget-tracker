package com.budget.auth.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LoginUserRequestDTO {
    @Valid
    @NotNull(message = "Enter your email")
    @NotBlank(message = "Enter your email")
    private String email;
    @NotNull(message = "Enter your password")
    @NotBlank(message = "Enter your password")
    private String password;
}

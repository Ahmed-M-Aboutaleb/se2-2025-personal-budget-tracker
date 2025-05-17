package com.budget.auth.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class NewUserRequestDTO {
    @Valid
    @NotNull(message = "Enter your first name")
    @NotBlank(message = "Enter your last name")
    private String first_name;
    @NotNull(message = "Enter your first name")
    @NotBlank(message = "Enter your last name")
    private String last_name;
    @NotNull(message = "Enter your username")
    @NotBlank(message = "Enter your username")
    private String username;
    @NotNull(message = "Enter your email")
    @NotBlank(message = "Enter your email")
    private String email;
    @NotNull(message = "Enter your password")
    @NotBlank(message = "Enter your password")
    private String password;
}

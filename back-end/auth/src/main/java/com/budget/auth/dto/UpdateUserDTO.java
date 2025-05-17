package com.budget.auth.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data

public class UpdateUserDTO {
    @Valid
    @NotNull(message = "Enter your first name")
    @NotBlank(message = "Enter your last name")
    private String first_name;
    @NotNull(message = "Enter your first name")
    @NotBlank(message = "Enter your last name")
    private String last_name;
    @NotNull(message = "Enter your password")
    @NotBlank(message = "Enter your password")
    private String password;
}

package com.budget.budget.dto;

import com.budget.budget.models.AccountType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateAccountDTO {
    @Valid
    @NotNull(message = "Enter account name")
    @NotBlank(message = "Enter account name")
    private String name;
    @NotNull(message = "Account type is required")
    private AccountType type;
}

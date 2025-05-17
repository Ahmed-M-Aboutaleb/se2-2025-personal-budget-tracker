package com.budget.budget.dto;

import com.budget.budget.models.AccountType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class NewAccountDTO {
    @Valid
    @NotNull(message = "Enter account name")
    @NotBlank(message = "Enter account name")
    private String name;
    @NotNull(message = "Account type is required")
    private AccountType type;
    @NotNull(message = "Enter account balance")
    @DecimalMin(value = "0.00", inclusive = true, message = "Account balance must be zero or positive")
    private BigDecimal balance;
}

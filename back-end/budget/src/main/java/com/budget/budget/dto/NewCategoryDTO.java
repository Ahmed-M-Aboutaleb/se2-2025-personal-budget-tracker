package com.budget.budget.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NewCategoryDTO {
    @Valid
    @NotNull(message = "Enter category name")
    @NotBlank(message = "Enter category name")
    private String name;
}

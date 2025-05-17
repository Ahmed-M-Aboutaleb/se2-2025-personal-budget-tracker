package com.budget.budget.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class UpdateEntryDTO {
    @Valid
    @NotNull(message = "Category ID is required")
    private Integer categoryId;
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.00", inclusive = false, message = "Amount must be greater than zero")
    private BigDecimal amount;
    @NotNull(message = "Date is required")
    @PastOrPresent(message = "Date cannot be in the future")
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date date;
    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;
    @NotNull(message = "Must specify whether this is an expense or income")
    private Boolean expense;
}

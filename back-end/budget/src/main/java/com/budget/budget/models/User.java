package com.budget.budget.models;

import lombok.Data;

@Data
public class User {
    private int id;
    private String first_name;
    private String last_name;
    private String email;
    private String username;
}

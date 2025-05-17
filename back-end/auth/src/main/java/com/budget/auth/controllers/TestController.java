package com.budget.auth.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Test controller to verify AOP functionality
 */
@RestController
@RequestMapping("/api/test")
public class TestController {

    /**
     * Simple test endpoint to verify AOP logging
     * 
     * @return A test message
     */
    @GetMapping
    public String testAop() {
        return "AOP test successful!";
    }
}

package com.budget.budget.clients;

import com.budget.budget.models.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "user-service", url="${application.config.users-url}")
public interface UserClient {
    @GetMapping("/me")
    User getMe();
}

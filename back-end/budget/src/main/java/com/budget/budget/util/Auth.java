package com.budget.budget.util;

import com.budget.budget.clients.UserClient;
import com.budget.budget.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class Auth {
    private static ApplicationContext context;

    @Autowired
    public Auth(ApplicationContext context) {
        Auth.context = context;
    }

    public static User auth() {
        if (context == null) {
            throw new IllegalStateException("Application context not initialized");
        }

        UserClient userClient = context.getBean(UserClient.class);
        User myUser = userClient.getMe();

        if (myUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        return myUser;
    }
}
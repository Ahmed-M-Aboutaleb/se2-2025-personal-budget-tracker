package com.budget.auth.aspects;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Aspect
@Component
public class LoginMonitorAspect {
    
    private static final Logger logger = LoggerFactory.getLogger(LoginMonitorAspect.class);
    
    @PostConstruct
    public void init() {
        logger.info("LoginMonitorAspect initialized");
    }

    @Pointcut("execution(* com.budget.auth.controllers.AuthController.login(..))")
    public void loginEndpoint() {}
    
    @AfterReturning(pointcut = "loginEndpoint()", returning = "result")
    public void logSuccessfulLogin(JoinPoint joinPoint, Object result) {
        logger.info("Controller login method executed successfully");
        Object[] args = joinPoint.getArgs();
        if (args.length > 0 && args[0] != null) {
            logger.info("Login attempt with argument type: {}", args[0].getClass().getName());
        }
    }
    
    @AfterThrowing(pointcut = "loginEndpoint()", throwing = "exception")
    public void logFailedLogin(JoinPoint joinPoint, Throwable exception) {
        logger.error("Controller login method failed with exception: {}", exception.getMessage());
    }
}

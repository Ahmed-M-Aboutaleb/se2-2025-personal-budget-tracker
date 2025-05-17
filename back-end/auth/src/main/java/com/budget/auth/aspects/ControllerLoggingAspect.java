package com.budget.auth.aspects;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Aspect
@Component
public class ControllerLoggingAspect {
    
    private static final Logger logger = LoggerFactory.getLogger(ControllerLoggingAspect.class);
    
    @PostConstruct
    public void init() {
        logger.info("ControllerLoggingAspect initialized");
    }
    @Pointcut("execution(* com.budget.auth.controllers.*.*(..))")
    public void controllerMethods() {}
    @Before("controllerMethods()")
    public void logControllerMethodCall(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().toShortString();
        logger.info("Controller method called: {}", methodName);
    }
}

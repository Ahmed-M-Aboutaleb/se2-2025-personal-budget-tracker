package com.budget.budget.aspects;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;


@Aspect
@Component
public class ExceptionHandlingAspect {
    
    private static final Logger logger = LoggerFactory.getLogger(ExceptionHandlingAspect.class);
    
    @Pointcut("execution(* com.budget.budget.services.*.*(..))")
    public void serviceMethods() {}
    
    @AfterThrowing(pointcut = "serviceMethods()", throwing = "exception")
    public void logServiceException(JoinPoint joinPoint, Throwable exception) {
        String methodName = joinPoint.getSignature().toShortString();
        logger.error("Exception in {}: {} - {}", 
                methodName, 
                exception.getClass().getSimpleName(),
                exception.getMessage());
    }
}

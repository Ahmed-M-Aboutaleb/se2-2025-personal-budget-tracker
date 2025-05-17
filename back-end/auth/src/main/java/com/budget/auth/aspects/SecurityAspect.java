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
public class SecurityAspect {
    
    private static final Logger logger = LoggerFactory.getLogger(SecurityAspect.class);
    
    @PostConstruct
    public void init() {
        logger.info("SecurityAspect initialized");
    }
    
    @Pointcut("execution(* com.budget.auth.services.AuthService.*(..))")
    public void authServiceMethods() {}

    @AfterReturning(pointcut = "authServiceMethods()")
    public void logAuthServiceCall(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().toShortString();
        logger.info("Auth service method called and completed successfully: {}", methodName);
    }
    

    @AfterThrowing(pointcut = "authServiceMethods()", throwing = "exception")
    public void logAuthServiceException(JoinPoint joinPoint, Throwable exception) {
        String methodName = joinPoint.getSignature().toShortString();
        logger.error("Auth service method '{}' threw exception: {}", methodName, exception.getMessage());
    }
    

    @Pointcut("execution(* com.budget.auth.services.AuthService.login(..))")
    public void loginMethod() {}
    

    @AfterReturning(pointcut = "loginMethod()", returning = "result")
    public void logSuccessfulLogin(JoinPoint joinPoint, Object result) {
        logger.debug("Login method completed successfully");
        Object[] args = joinPoint.getArgs();
        if (args.length > 0 && args[0] != null) {
            try {
                if (args[0].getClass().getSimpleName().equals("LoginUserRequestDTO")) {
                    java.lang.reflect.Method getEmail = args[0].getClass().getMethod("getEmail");
                    String email = (String) getEmail.invoke(args[0]);
                    logger.info("Successful login for user: {}", email);
                } else {
                    logger.info("Successful login with args: {}", args[0]);
                }
            } catch (Exception e) {
                logger.warn("Error extracting email from arguments: {}", e.getMessage());
            }
        }
    }
    
    @AfterThrowing(pointcut = "loginMethod()", throwing = "exception")
    public void logFailedLogin(JoinPoint joinPoint, Throwable exception) {
        logger.debug("Login method threw exception");
        Object[] args = joinPoint.getArgs();
        if (args.length > 0 && args[0] != null) {
            try {
                if (args[0].getClass().getSimpleName().equals("LoginUserRequestDTO")) {
                    java.lang.reflect.Method getEmail = args[0].getClass().getMethod("getEmail");
                    String email = (String) getEmail.invoke(args[0]);
                    logger.warn("Failed login attempt for user: {}, reason: {}", 
                           email, exception.getMessage());
                } else {
                    logger.warn("Failed login with args: {}, reason: {}", 
                           args[0], exception.getMessage());
                }
            } catch (Exception e) {
                logger.warn("Error extracting email from arguments: {}", e.getMessage());
            }
        }
    }
}

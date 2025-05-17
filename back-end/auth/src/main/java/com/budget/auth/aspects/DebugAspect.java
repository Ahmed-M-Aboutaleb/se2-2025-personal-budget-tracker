package com.budget.auth.aspects;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;


@Aspect
@Component
public class DebugAspect {
    
    @Pointcut("execution(* com.budget.auth.services.AuthService.*(..))")
    public void anyAuthServiceMethod() {}
    
    @Pointcut("execution(* com.budget.auth.controllers.*.*(..))")
    public void anyControllerMethod() {}
    
    @Before("anyAuthServiceMethod()")
    public void directLogAuthServiceMethod(JoinPoint joinPoint) {
        System.out.println("==== DIRECT DEBUG LOG ====");
        System.out.println("AuthService method called: " + joinPoint.getSignature().toShortString());
        System.out.println("==========================");
    }
    
    @Before("anyControllerMethod()")
    public void directLogControllerMethod(JoinPoint joinPoint) {
        System.out.println("==== DIRECT DEBUG LOG ====");
        System.out.println("Controller method called: " + joinPoint.getSignature().toShortString());
        System.out.println("==========================");
    }
}

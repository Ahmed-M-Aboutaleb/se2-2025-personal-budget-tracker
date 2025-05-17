package com.budget.budget.aspects;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import java.lang.reflect.Method;

@Aspect
@Component
public class LoggingAspect {
    
    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);
    
    @Pointcut("execution(* com.budget.budget.controllers.*.*(..))")
    public void controllerMethods() {}
    
    @Around("controllerMethods()")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        Method method = methodSignature.getMethod();
        
        final StopWatch stopWatch = new StopWatch();
        
        stopWatch.start();
        Object result = joinPoint.proceed();
        stopWatch.stop();
        
        logger.info("Execution time of {}.{} :: {} ms", 
                method.getDeclaringClass().getSimpleName(),
                method.getName(), 
                stopWatch.getTotalTimeMillis());
        
        return result;
    }
}

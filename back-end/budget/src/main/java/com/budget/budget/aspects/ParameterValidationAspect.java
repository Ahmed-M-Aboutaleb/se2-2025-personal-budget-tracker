package com.budget.budget.aspects;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Aspect
@Component
public class ParameterValidationAspect {
    
    private static final Logger logger = LoggerFactory.getLogger(ParameterValidationAspect.class);
    

    @Pointcut("execution(* com.budget.budget.services.EntryService.create*(..)) || " +
              "execution(* com.budget.budget.services.EntryService.update*(..)) ")
    public void entryModificationMethods() {}
    
    @Before("entryModificationMethods() && args(.., amount, ..)")
    public void validateAmount(JoinPoint joinPoint, BigDecimal amount) {
        if (amount == null) {
            logger.warn("Null amount detected in method: {}", joinPoint.getSignature().toShortString());
            throw new IllegalArgumentException("Amount cannot be null");
        }
        
        if (amount.compareTo(BigDecimal.ZERO) == 0) {
            logger.warn("Zero amount detected in method: {}", joinPoint.getSignature().toShortString());
        }
        
        if (amount.scale() > 4) {
            logger.warn("Amount with scale > 4 detected in method: {}", joinPoint.getSignature().toShortString());
            throw new IllegalArgumentException("Amount cannot have more than 4 decimal places");
        }
    }
}

package com.skillsync.utility;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    @Around("execution(* com.skillsync.service.*.*(..))")
    public Object logServiceCall(ProceedingJoinPoint pjp) throws Throwable {
        Logger logger = LoggerFactory.getLogger(pjp.getTarget().getClass());
        logger.info("Entering: {}({})", pjp.getSignature().getName(), pjp.getArgs());
        long start = System.currentTimeMillis();
        Object result = pjp.proceed();
        logger.info("Exiting: {} — {}ms", pjp.getSignature().getName(), System.currentTimeMillis() - start);
        return result;
    }

    @AfterThrowing(pointcut = "execution(* com.skillsync.repository.*.*(..))", throwing = "ex")
    public void logRepositoryException(Exception ex) {
        Logger logger = LoggerFactory.getLogger(LoggingAspect.class);
        logger.error("Repository exception: {}", ex.getMessage());
    }
}

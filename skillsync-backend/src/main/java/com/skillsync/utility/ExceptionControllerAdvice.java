package com.skillsync.utility;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class ExceptionControllerAdvice {

    private final Environment environment;

    public ExceptionControllerAdvice(Environment environment) {
        this.environment = environment;
    }

    @ExceptionHandler(SkillSyncException.class)
    public ResponseEntity<ErrorInfo> handleSkillSyncException(SkillSyncException ex, HttpServletRequest req) {
        String message = environment.getProperty(ex.getMessage(), ex.getMessage());
        ErrorInfo error = new ErrorInfo(HttpStatus.BAD_REQUEST.value(), message, req.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorInfo> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        List<String> errors = ex.getBindingResult().getFieldErrors()
                .stream().map(FieldError::getDefaultMessage).toList();
        ErrorInfo error = new ErrorInfo(HttpStatus.BAD_REQUEST.value(), "Validation failed", req.getRequestURI(), errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorInfo> handleConstraint(ConstraintViolationException ex, HttpServletRequest req) {
        List<String> errors = ex.getConstraintViolations().stream()
                .map(cv -> cv.getPropertyPath() + ": " + cv.getMessage()).toList();
        ErrorInfo error = new ErrorInfo(HttpStatus.BAD_REQUEST.value(), "Validation failed", req.getRequestURI(), errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorInfo> handleNotReadable(HttpServletRequest req) {
        ErrorInfo error = new ErrorInfo(HttpStatus.BAD_REQUEST.value(), "Malformed or missing request body", req.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorInfo> handleGeneral(Exception ex, HttpServletRequest req) {
        ErrorInfo error = new ErrorInfo(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected error occurred", req.getRequestURI());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}

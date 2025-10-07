package com.bookhive.config;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.converter.HttpMessageNotReadableException;

import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String,Object>> handleBadCreds(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error","invalid_credentials","message","Invalid email or password"));
    }

    @ExceptionHandler({
            IllegalArgumentException.class,
            HttpMessageNotReadableException.class,
            MethodArgumentNotValidException.class
    })
    public ResponseEntity<Map<String,Object>> handleBadRequest(Exception ex) {
        String msg = ex.getMessage();
        if (msg == null || msg.isBlank()) msg = "Bad request";
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error","bad_request","message", msg));
    }

    @ExceptionHandler({ NoSuchElementException.class })
    public ResponseEntity<Map<String,Object>> handleNotFound(Exception ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error","not_found","message", ex.getMessage() == null ? "Not found" : ex.getMessage()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String,Object>> handleConstraint(Exception ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error","constraint_violation","message","Operation violates data constraints"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String,Object>> handleOther(Exception ex) {
        // Last resort to avoid silent 500s with no message
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error","server_error","message", ex.getMessage() == null ? "Server error" : ex.getMessage()));
    }
}

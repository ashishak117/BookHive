package com.bookhive.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${app.jwt.secret:BookHiveSuperSecretKeyThatIsAtLeast32BytesLong!123456}")
    private String secret;

    @Value("${app.jwt.expiryMinutes:1440}") // 24h default
    private long expiryMinutes;

    private SecretKey key;
    private long expMs;

    @PostConstruct
    public void init() {
        key = Keys.hmacShaKeyFor(secret.getBytes()); // >= 32 bytes
        expMs = expiryMinutes * 60_000L;
    }

    public String generateToken(String subject, String role, Long userId) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(subject)
                .claim("role", role)
                .claim("uid", userId)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + expMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims getAllClaims(String token) {
        // allow 60s skew to avoid 401 because of system clock drift
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .setAllowedClockSkewSeconds(60)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}


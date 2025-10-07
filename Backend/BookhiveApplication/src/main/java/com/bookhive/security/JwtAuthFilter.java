package com.bookhive.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthFilter.class);

    private final JwtService jwt;
    private final UserDetailsService uds;

    public JwtAuthFilter(JwtService jwt, UserDetailsService uds) {
        this.jwt = jwt;
        this.uds = uds;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String p = request.getRequestURI(); // includes /api
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) return true;

        // Only skip these:
        if (p.equals("/api/auth/login") || p.equals("/api/auth/register") || p.equals("/api/auth/ping")) {
            return true;
        }

        // Public books listing
        if (HttpMethod.GET.matches(request.getMethod()) && p.startsWith("/api/books")) return true;

        // Everything else (including /api/auth/me, /api/orders, /api/orders/mine) must be filtered
        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        String path = req.getRequestURI();
        String auth = req.getHeader("Authorization");

        if (auth == null || !auth.startsWith("Bearer ")) {
            // Let it fall through to 401 by Security — but log for debugging
            chain.doFilter(req, res);
            return;
        }

        String token = auth.substring(7).trim();
        try {
            Claims claims = jwt.getAllClaims(token);
            String email = claims.getSubject();
            if (email == null || email.isBlank()) {
                chain.doFilter(req, res);
                return;
            }
            UserDetails user = uds.loadUserByUsername(email);
            UsernamePasswordAuthenticationToken at =
                    new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(at);
            chain.doFilter(req, res);
        } catch (Exception ex) {
            SecurityContextHolder.clearContext();
            chain.doFilter(req, res);
        }
    }
}

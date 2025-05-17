package com.budget.auth.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    @Value(("${jwt.secret}"))
    private String secret;
    @Value(("${jwt.expirationMs}"))
    private long expirationMs;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> claims, UserDetails userDetails) {
        return buildToken(claims,userDetails, expirationMs);
    }

    public long getExpirationTime() {
        return expirationMs;
    }    private String buildToken(Map<String, Object> claims, UserDetails userDetails, long expirationMs) {
        // Store additional information in claims if needed
        claims.put("sub", userDetails.getUsername()); // Subject is always the username/email
        
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            boolean isValid = (username != null && 
                    username.equals(userDetails.getUsername()) && 
                    !isTokenExpired(token));
            
            System.out.println("Token validation for user " + username + ": " + (isValid ? "VALID" : "INVALID"));
            
            if (!isValid) {
                if (username == null) {
                    System.out.println("Username from token is null");
                } else if (!username.equals(userDetails.getUsername())) {
                    System.out.println("Username mismatch: token=" + username + ", userDetails=" + userDetails.getUsername());
                }
                if (isTokenExpired(token)) {
                    System.out.println("Token is expired");
                }
            }
            
            return isValid;
        } catch (Exception e) {
            System.err.println("Token validation error: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            Date expiration = extractExpiration(token);
            return expiration != null && expiration.before(new Date());
        } catch (Exception e) {
            System.err.println("Error checking token expiration: " + e.getMessage());
            return true; // Consider invalid tokens as expired
        }
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            // Log the specific exception but don't expose internal details in production
            System.err.println("Error extracting claims from token: " + e.getMessage());
            throw e; // Rethrow to be handled by the filter
        }
    }private Key getSignInKey() {
        try {
            // Convert the secret directly to bytes and use them for the key
            byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate signing key", e);
        }
    }
}

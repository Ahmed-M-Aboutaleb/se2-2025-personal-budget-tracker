package com.budget.auth.util;

import com.budget.auth.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private HandlerExceptionResolver handlerExceptionResolver;
    @Autowired
    private JwtService jwtService;
    @Autowired
    @Lazy
    private UserDetailsService userDetailsService;    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain chain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }
        
        try {
            final String token = authHeader.substring(7);
            String username = jwtService.extractUsername(token);
            System.out.println("Extracted username/email from token: " + username);
            
            if(username != null) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                
                if (auth == null || !auth.isAuthenticated()) {
                    try {
                        UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                        System.out.println("Successfully loaded user: " + username);
                        
                        if(userDetails != null && jwtService.validateToken(token, userDetails)) {
                            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities()
                            );
                            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            
                            SecurityContextHolder.getContext().setAuthentication(authToken);
                            
                            System.out.println("Successfully authenticated user: " + username);
                        } else {
                            System.out.println("Token validation failed for user: " + username);
                        }
                    } catch (UsernameNotFoundException e) {
                        System.err.println("User not found in database: " + username);
                    }
                } else {
                    System.out.println("User already authenticated: " + username);
                }
            } else {
                System.err.println("Failed to extract username from token");
            }
            
            chain.doFilter(request, response);
        } catch (Exception e) {
            System.err.println("JWT authentication error: " + e.getMessage());
            e.printStackTrace();
            handlerExceptionResolver.resolveException(request, response, null, e);
        }
    }
}

package com.budget.budget.util;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignClientInterceptorConfig {

    @Bean
    public RequestInterceptor propagateAuthHeader() {
        return template -> {
            RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
            if (requestAttributes instanceof ServletRequestAttributes servletAttrs) {
                String authHeader = servletAttrs.getRequest().getHeader(HttpHeaders.AUTHORIZATION);
                if (authHeader != null) {
                    template.header(HttpHeaders.AUTHORIZATION, authHeader);
                }
            }
        };
    }
}
package com.ssafy.ddukdoc.global.config.security;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.domain.prod}")
    private String prod;

    @Value("${app.domain.local}")
    private String local;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(local, prod)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("Authorization", "Content-Type", "X-Requested-With",
                        "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials","Access-Control-Allow-Headers",
                        "Accept", "Origin", "Cookie", "Set-Cookie",
                        "Cache-Control", "Connection")
                .exposedHeaders("Set-Cookie")
                .allowCredentials(true)
                .maxAge(3600);
    }
}

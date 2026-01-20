package com.ecommerce.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.context.annotation.Bean;


@Configuration
public class CorsConfig implements WebMvcConfigurer {

   /**
     * Configures Cross-Origin Resource Sharing (CORS) settings for the application.
     * Allows requests from http://localhost:5173 with specified methods, headers,
     * and credentials to access endpoints under /api/**.
     *
     * @return WebMvcConfigurer implementation that applies CORS configuration
     */

     @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }




}

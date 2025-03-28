package com.ssafy.ddukdoc.global.config.swagger;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import io.swagger.v3.core.jackson.ModelResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerModelResolverConfig {

    @Bean
    public ModelResolver modelResolver(ObjectMapper objectMapper) {
        ObjectMapper swaggerObjectMapper = objectMapper.copy();
        swaggerObjectMapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);

        return new ModelResolver(swaggerObjectMapper);
    }
}
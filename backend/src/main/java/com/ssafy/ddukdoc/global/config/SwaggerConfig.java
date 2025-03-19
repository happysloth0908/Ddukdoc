package com.ssafy.ddukdoc.global.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
//    http://localhost:8080/swagger-ui/index.html
    @Bean
    public OpenAPI openAPI() {
        // JWT 인증 설정
//        String jwtSchemeName = "JWT";
//        SecurityRequirement securityRequirement = new SecurityRequirement().addList(jwtSchemeName);

        // 쿠키 인증 설정
        String cookieSchemeName = "cookieAuth";
        SecurityRequirement cookieSecurityRequirement = new SecurityRequirement().addList(cookieSchemeName);

        // 컴포넌트 설정
        Components components = new Components()
                // JWT 보안 스키마 설정
//                .addSecuritySchemes(jwtSchemeName, new SecurityScheme()
//                        .name(jwtSchemeName)
//                        .type(SecurityScheme.Type.HTTP)
//                        .scheme("bearer")
//                        .bearerFormat("JWT")
//                )
                // 쿠키 보안 스키마 설정
                .addSecuritySchemes(cookieSchemeName, new SecurityScheme()
                        .name(cookieSchemeName)
                        .type(SecurityScheme.Type.APIKEY)
                        .in(SecurityScheme.In.COOKIE)
                        .name("accessToken") // 쿠키 이름 설정
                );

        return new OpenAPI()
                .info(apiInfo())
//                .addSecurityItem(securityRequirement) // JWT 인증 요구사항 추가
                .addSecurityItem(cookieSecurityRequirement) // 쿠키 인증 요구사항 추가
                .components(components);
    }

    private Info apiInfo() {
        return new Info()
                .title("API Test")
                .description("Let's practice Swagger UI with cookie authentication")
                .version("1.0.0");
    }
}

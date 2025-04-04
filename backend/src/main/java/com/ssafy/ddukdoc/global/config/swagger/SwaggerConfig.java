package com.ssafy.ddukdoc.global.config.swagger;

import com.ssafy.ddukdoc.global.aop.swagger.ApiErrorCodeExample;
import com.ssafy.ddukdoc.global.aop.swagger.ApiErrorCodeExamples;
import com.ssafy.ddukdoc.global.aop.swagger.ExampleHolder;
import com.ssafy.ddukdoc.global.common.constants.SecurityConstants;
import com.ssafy.ddukdoc.global.common.response.CommonResponse;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.examples.Example;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.HandlerMethod;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
public class SwaggerConfig {
//    http://localhost:8080/swagger-ui/index.html
    @Bean
    public OpenAPI openAPI() {
        // 쿠키 인증 설정
        String cookieSchemeName = "cookieAuth";
        SecurityRequirement cookieSecurityRequirement = new SecurityRequirement().addList(cookieSchemeName);

        // 개발자용 헤더 인증 설정
        String devHeaderSchemeName = "devUserAuth";
        SecurityRequirement devHeaderSecurityRequirement = new SecurityRequirement().addList(devHeaderSchemeName);

        // 컴포넌트 설정
        Components components = new Components()
                // 쿠키 보안 스키마 설정
                .addSecuritySchemes(cookieSchemeName, new SecurityScheme()
                        .name(cookieSchemeName)
                        .type(SecurityScheme.Type.APIKEY)
                        .in(SecurityScheme.In.COOKIE)
                        .name(SecurityConstants.ACCESS_TOKEN_COOKIE_NAME) // 쿠키 이름 설정
                        .description("인증된 사용자의 액세스 토큰이 포함된 쿠키")
                )
                // 개발자용 헤더 인증 설정
                .addSecuritySchemes(devHeaderSchemeName, new SecurityScheme()
                        .name(devHeaderSchemeName)
                        .type(SecurityScheme.Type.APIKEY)
                        .in(SecurityScheme.In.HEADER)
                        .name("X-DEV-USER") // 개발자 헤더 이름
                        .description("개발 환경에서 사용되는 사용자 ID (숫자)")
                );

        // 서버 URL 설정
        Server devServer = new Server();
        devServer.setUrl("https://ddukdoc.shop");
        devServer.setDescription("개발용 서버입니다.");

        Server prodServer = new Server();
        prodServer.setUrl("https://j12b108.p.ssafy.io");
        prodServer.setDescription("실 운용 서버입니다.(개발자용 토큰 사용 불가)");

        Server localServer = new Server();
        localServer.setUrl("http://localhost:8080");
        localServer.setDescription("localhost 테스트용입니다.");

        return new OpenAPI()
                .info(apiInfo())
                .addSecurityItem(cookieSecurityRequirement) // 쿠키 인증 요구사항 추가
                .addSecurityItem(devHeaderSecurityRequirement) // 개발자 헤더 인증 요구사항 추가
                .components(components)
                .servers(List.of(devServer, prodServer, localServer));
    }

    @Bean
    public OperationCustomizer customize() {
        return (Operation operation, HandlerMethod handlerMethod) -> {
            // 에러 응답 예시 처리
            ApiErrorCodeExamples apiErrorCodeExamples = handlerMethod.getMethodAnnotation(
                    ApiErrorCodeExamples.class);

            if (apiErrorCodeExamples != null) {
                generateErrorCodeResponseExample(operation, apiErrorCodeExamples.value());
            } else {
                ApiErrorCodeExample apiErrorCodeExample = handlerMethod.getMethodAnnotation(
                        ApiErrorCodeExample.class);

                if (apiErrorCodeExample != null) {
                    generateErrorCodeResponseExample(operation, apiErrorCodeExample.value());
                }
            }

            return operation;
        };
    }

    // 여러 개의 에러 응답값 추가
    private void generateErrorCodeResponseExample(Operation operation, ErrorCode[] errorCodes) {
        ApiResponses responses = operation.getResponses();

        // ExampleHolder(에러 응답값) 객체를 만들고 에러 코드별로 그룹화
        Map<Integer, List<ExampleHolder>> statusWithExampleHolders = Arrays.stream(errorCodes)
                .map(
                        errorCode -> ExampleHolder.builder()
                                .holder(getSwaggerExample(errorCode))
                                .code(errorCode.getStatus().value())
                                .name(errorCode.name())
                                .build()
                )
                .collect(Collectors.groupingBy(ExampleHolder::getCode));

        // ExampleHolders를 ApiResponses에 추가
        addExamplesToResponses(responses, statusWithExampleHolders);
    }

    // 단일 에러 응답값 예시 추가
    private void generateErrorCodeResponseExample(Operation operation, ErrorCode errorCode) {
        ApiResponses responses = operation.getResponses();

        // ExampleHolder 객체 생성 및 ApiResponses에 추가
        ExampleHolder exampleHolder = ExampleHolder.builder()
                .holder(getSwaggerExample(errorCode))
                .name(errorCode.name())
                .code(errorCode.getStatus().value())
                .build();
        addExamplesToResponses(responses, exampleHolder);
    }

    // ErrorResponseDto 형태의 예시 객체 생성
    private Example getSwaggerExample(ErrorCode errorCode) {
        CommonResponse<?> errorResponseExample = CommonResponse.errorExample(errorCode);
        Example example = new Example();
        example.setValue(errorResponseExample);
        return example;
    }

    // exampleHolder를 ApiResponses에 추가
    private void addExamplesToResponses(ApiResponses responses,
                                        Map<Integer, List<ExampleHolder>> statusWithExampleHolders) {
        statusWithExampleHolders.forEach(
                (status, v) -> {
                    Content content = new Content();
                    MediaType mediaType = new MediaType();
                    ApiResponse apiResponse = new ApiResponse();

                    v.forEach(
                            exampleHolder -> mediaType.addExamples(
                                    exampleHolder.getName(),
                                    exampleHolder.getHolder()
                            )
                    );
                    content.addMediaType("application/json", mediaType);
                    apiResponse.setContent(content);
                    responses.addApiResponse(String.valueOf(status), apiResponse);
                }
        );
    }

    private void addExamplesToResponses(ApiResponses responses, ExampleHolder exampleHolder) {
        Content content = new Content();
        MediaType mediaType = new MediaType();
        ApiResponse apiResponse = new ApiResponse();

        mediaType.addExamples(exampleHolder.getName(), exampleHolder.getHolder());
        content.addMediaType("application/json", mediaType);
        apiResponse.content(content);
        responses.addApiResponse(String.valueOf(exampleHolder.getCode()), apiResponse);
    }

    private Info apiInfo() {
        return new Info()
                .title("뚝딱뚝Doc")
                .description("Api 문서입니다. \n\n **Query Parameter** : Camel Case (ex. `userId`, `documentId`) \n\n **Request Body** : Camel Case (ex. `userId`, `documentId`) \n\n **Response Body** : Snake Case (ex. `user_id`, `document_id`)")
                .version("1.0.0");
    }
}

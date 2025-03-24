package com.ssafy.ddukdoc.global.error.handler;

import com.ssafy.ddukdoc.global.common.response.ApiResponse;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 비즈니스 로직에서 명시적으로 발생시킨 커스텀 예외 처리
     * 사용법: throw new CustomException(ErrorCode.XXX)
     * 또는: throw new CustomException(ErrorCode.XXX, "paramName", paramValue)
     */
    @ExceptionHandler(CustomException.class)
    protected ResponseEntity<ApiResponse<Object>> handleCustomException(CustomException e, HttpServletRequest request) {
        if (!e.getParameters().isEmpty()) {
            log.error("[CustomException] {} {}: {} - Parameters: {}",
                    request.getMethod(),
                    request.getRequestURI(),
                    e.getMessage(),
                    e.getParameters()
            );
        } else {
            log.error("[CustomException] {} {}: {}",
                    request.getMethod(),
                    request.getRequestURI(),
                    e.getMessage()
            );
        }

        return ApiResponse.error(e.getErrorCode());
    }

    /**
     * 요청 DTO 객체의 유효성 검증(@Valid) 실패 시 발생하는 예외 처리
     * 발생 조건: @Valid 어노테이션이 지정된 파라미터의 유효성 검증 실패 시
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<ApiResponse<Object>> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException e, HttpServletRequest request) {

        FieldError fieldError = e.getBindingResult().getFieldError();
        String field = fieldError.getField();
        String defaultMessage = fieldError.getDefaultMessage();

        log.error("[ValidationException] {} {}: field '{}' - {}",
                request.getMethod(),
                request.getRequestURI(),
                field,
                defaultMessage
        );
        return ApiResponse.error(ErrorCode.INVALID_INPUT_VALUE, field + " : " + defaultMessage);
    }

    /**
     * 존재하지 않는 API 엔드포인트 요청 시 발생하는 예외 처리
     * 발생 조건: 매핑되지 않은 URL로 요청이 들어올 때
     */
    @ExceptionHandler(NoResourceFoundException.class)
    protected ResponseEntity<ApiResponse<Object>> handleNoResourceFoundException(
            NoResourceFoundException e, HttpServletRequest request) {
        log.warn("[ResourceNotFound] {} {}", request.getMethod(), request.getRequestURI());
        return ApiResponse.error(ErrorCode.RESOURCE_NOT_FOUND);
    }

    /**
     * 잘못된 인자 값으로 인한 예외 처리
     * 발생 조건:
     * 1. 메서드에 부적절한 인자가 전달될 때
     * 2. 비즈니스 로직에서 throw new IllegalArgumentException() 사용 시
     */
    @ExceptionHandler(IllegalArgumentException.class)
    protected ResponseEntity<ApiResponse<Object>> handleIllegalArgumentException(
            IllegalArgumentException e, HttpServletRequest request) {
        // HTTP 메소드 이름 관련 예외는 보안 시도로 간주
        if (e.getMessage() != null && e.getMessage().contains("HTTP method names must be tokens")) {
            log.warn("[InvalidRequest] Malformed HTTP method from IP: {}",
                    request.getRemoteAddr());
            return ApiResponse.error(ErrorCode.INVALID_INPUT_VALUE);
        }

        // 다른 IllegalArgumentException은 기존대로 처리
        log.error("[IllegalArgument] {} {}: {}",
                request.getMethod(),
                request.getRequestURI(),
                e.getMessage());
        return ApiResponse.error(ErrorCode.INVALID_INPUT_VALUE);
    }

    /**
     * 기타 모든 처리되지 않은 예외를 처리하는 폴백 핸들러
     * 발생 조건: 위 핸들러에서 처리되지 않은 모든 예외 발생 시
     */
    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ApiResponse<Object>> handleException(Exception e, HttpServletRequest request) {
        log.error("[UnhandledException] {} {}: {}",
                request.getMethod(),
                request.getRequestURI(),
                e.getMessage(),
                e);
        return ApiResponse.error(ErrorCode.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    protected ResponseEntity<ApiResponse<Object>> handleMissingServletRequestPartException(
            MissingServletRequestPartException e,
            HttpServletRequest request
    ) {
        log.error("[MissingServletRequestPartException] {} {}: {}",
                request.getMethod(),
                request.getRequestURI(),
                e.getMessage()
        );

        return ApiResponse.error(ErrorCode.INVALID_INPUT_VALUE);
    }
}

package com.ssafy.ddukdoc.global.common.response;

import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import lombok.Getter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

@Getter
public class ApiResponse<T> {

    private final boolean success;
    private final T data;
    private final ErrorResponse error;
    private final LocalDateTime timestamp;

    private ApiResponse(boolean success, T data, ErrorResponse error) {
        this.success = success;
        this.data = data;
        this.error = error;
        this.timestamp = LocalDateTime.now();
    }

    /**
     * 지정된 HTTP 상태로 성공 응답을 생성합니다.
     *
     * @param status 반환할 HTTP 상태 (HttpStatus 사용)
     * @param <T> 응답 데이터의 타입
     * @return API 응답을 포함하는 ResponseEntity
     */
    public static <T> ResponseEntity<ApiResponse<T>> success(HttpStatus status) {
        return ResponseEntity
                .status(status)
                .body(new ApiResponse<>(true, null, null));
    }

    /**
     * 지정된 HTTP 상태와 데이터로 성공 응답을 생성합니다.
     *
     * @param status 반환할 HTTP 상태 (HttpStatus 사용)
     * @param data 응답에 포함할 데이터
     * @param <T> 응답 데이터의 타입
     * @return API 응답을 포함하는 ResponseEntity
     */
    public static <T> ResponseEntity<ApiResponse<T>> success(HttpStatus status, T data) {
        return ResponseEntity
                .status(status)
                .body(new ApiResponse<>(true, data, null));
    }

    /**
     * HTTP 200 OK 상태와 데이터 없이 성공 응답을 생성합니다.
     *
     * @param <T> 응답 데이터의 타입
     * @return API 응답을 포함하는 ResponseEntity
     */
    public static <T> ResponseEntity<ApiResponse<T>> ok() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ApiResponse<>(true, null, null));
    }

    /**
     * HTTP 200 OK 상태와 제공된 데이터로 성공 응답을 생성합니다.
     *
     * @param data 응답에 포함할 데이터
     * @param <T> 응답 데이터의 타입
     * @return API 응답을 포함하는 ResponseEntity
     */
    public static <T> ResponseEntity<ApiResponse<T>> ok(T data) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ApiResponse<>(true, data, null));
    }

    /**
     * HTTP 200 OK 상태와 데이터 없이, 제공된 쿠키로 성공 응답을 생성합니다.
     *
     * @param cookies 응답에 포함될 하나 이상의 쿠키
     * @param <T> 응답 데이터의 타입
     * @return API 응답과 쿠키를 포함하는 ResponseEntity
     */
    public static <T> ResponseEntity<ApiResponse<T>> okWithCookie(ResponseCookie... cookies) {
        HttpHeaders headers = new HttpHeaders();
        for (ResponseCookie cookie : cookies) {
            headers.add(HttpHeaders.SET_COOKIE, cookie.toString());
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(headers)
                .body(new ApiResponse<>(true, null, null));
    }

    /**
     * HTTP 200 OK 상태, 제공된 데이터 및 쿠키로 성공 응답을 생성합니다.
     *
     * @param data 응답에 포함할 데이터
     * @param cookies 응답에 포함될 하나 이상의 쿠키
     * @param <T> 응답 데이터의 타입
     * @return API 응답과 쿠키를 포함하는 ResponseEntity
     */
    public static <T> ResponseEntity<ApiResponse<T>> okWithCookie(T data, ResponseCookie... cookies) {
        HttpHeaders headers = new HttpHeaders();
        for (ResponseCookie cookie : cookies) {
            headers.add(HttpHeaders.SET_COOKIE, cookie.toString());
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(headers)
                .body(new ApiResponse<>(true, data, null));
    }

    /**
     * HTTP 201 Created 상태와 데이터 없이 성공 응답을 생성합니다.
     *
     * @param <T> 응답 데이터의 타입
     * @return API 응답을 포함하는 ResponseEntity
     */
    public static <T> ResponseEntity<ApiResponse<T>> created() {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, null, null));
    }

    /**
     * HTTP 201 Created 상태와 제공된 데이터로 성공 응답을 생성합니다.
     *
     * @param data 응답에 포함할 데이터
     * @param <T> 응답 데이터의 타입
     * @return API 응답을 포함하는 ResponseEntity
     */
    public static <T> ResponseEntity<ApiResponse<T>> created(T data) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, data, null));
    }

    /**
     * HTTP 204 No Content 상태로 성공 응답을 생성합니다.
     *
     * @param <T> 응답 데이터의 타입
     * @return API 응답을 포함하는 ResponseEntity
     */
    public static <T> ResponseEntity<ApiResponse<T>> noContent() {
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(new ApiResponse<>(true, null, null));
    }

    /**
     * HTTP 202 Accepted 상태와 데이터 없이 성공 응답을 생성합니다.
     *
     * @param <T> 응답 데이터의 타입
     * @return API 응답을 포함하는 ResponseEntity
     */
    public static <T> ResponseEntity<ApiResponse<T>> accepted() {
        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(new ApiResponse<>(true, null, null));
    }

    /**
     * HTTP 202 Accepted 상태와 제공된 데이터로 성공 응답을 생성합니다.
     *
     * @param data 응답에 포함할 데이터
     * @param <T> 응답 데이터의 타입
     * @return API 응답을 포함하는 ResponseEntity
     */
    public static <T> ResponseEntity<ApiResponse<T>> accepted(T data) {
        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(new ApiResponse<>(true, data, null));
    }

    /**
     * HTTP 302 Found 상태와 리다이렉션 URL로 응답을 생성합니다.
     *
     * @param location 리다이렉션할 URL
     * @param <T> 응답 데이터의 타입
     * @return API 응답을 포함하는 ResponseEntity
     */
    public static <T> ResponseEntity<ApiResponse<T>> found(String location) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.LOCATION, location);
        return ResponseEntity
                .status(HttpStatus.FOUND)
                .headers(headers)
                .body(new ApiResponse<>(true, null, null));
    }

    /**
     * HTTP 302 Found 상태와 리다이렉션 URL, 그리고 쿠키로 응답을 생성합니다.
     *
     * @param location 리다이렉션할 URL
     * @param cookies 응답에 포함될 하나 이상의 쿠키
     * @param <T> 응답 데이터의 타입
     * @return API 응답과 쿠키를 포함하는 ResponseEntity
     */
    public static <T> ResponseEntity<ApiResponse<T>> redirectWithCookie(String location, ResponseCookie... cookies) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.LOCATION, location);

        for (ResponseCookie cookie : cookies) {
            headers.add(HttpHeaders.SET_COOKIE, cookie.toString());
        }

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .headers(headers)
                .body(new ApiResponse<>(true, null, null));
    }

    /**
     * 제공된 오류 코드의 세부 정보로 오류 응답을 생성합니다.
     *
     * @param error 상태, 코드 및 메시지를 포함하는 오류 코드
     * @param <T> 응답 데이터의 타입
     * @return API 오류 응답을 포함하는 ResponseEntity
     */
    public static <T> ResponseEntity<ApiResponse<T>> error(ErrorCode error) {
        return ResponseEntity
                .status(error.getStatus())
                .body(new ApiResponse<>(false, null, new ErrorResponse(error.getCode(), error.getMessage())));
    }

    /**
     * 제공된 오류 코드에 대해 사용자 지정 메시지가 있는 오류 응답을 생성합니다.
     *
     * @param error 상태 및 코드를 포함하는 오류 코드
     * @param message 기본 메시지를 재정의하는 사용자 지정 오류 메시지
     * @param <T> 응답 데이터의 타입
     * @return API 오류 응답을 포함하는 ResponseEntity
     */
    public static <T> ResponseEntity<ApiResponse<T>> error(ErrorCode error, String message) {
        return ResponseEntity
                .status(error.getStatus())
                .body(new ApiResponse<>(false, null, new ErrorResponse(error.getCode(), message)));
    }
}
package com.ssafy.ddukdoc.global.util;

import com.ssafy.ddukdoc.global.common.constants.SecurityConstants;
import org.springframework.http.ResponseCookie;

import java.time.Duration;

public class CookieUtil {
    public static ResponseCookie makeAccessTokenCookie(String refreshToken) {
        return ResponseCookie.from(SecurityConstants.ACCESS_TOKEN_COOKIE_NAME, refreshToken)
                .httpOnly(true)
                .secure(true) // HTTPS 환경에서만 전송
                .sameSite("Strict") // CSRF 방지
                .domain(SecurityConstants.DOMAIN)
                .path("/") // 모든 경로에서 접근 가능
                .maxAge(Duration.ofSeconds(SecurityConstants.ACCESS_TOKEN_VALIDITY_SECONDS))
                .build();
    }

    public static ResponseCookie makeRefreshTokenCookie(String refreshToken) {
        return ResponseCookie.from(SecurityConstants.REFRESH_TOKEN_COOKIE_NAME, refreshToken)
                .httpOnly(true)
                .secure(true) // HTTPS 환경에서만 전송
                .sameSite("Strict") // CSRF 방지
                .domain(SecurityConstants.DOMAIN)
                .path("/") // 모든 경로에서 접근 가능
                .maxAge(Duration.ofSeconds(SecurityConstants.REFRESH_TOKEN_VALIDITY_SECONDS))
                .build();
    }
}

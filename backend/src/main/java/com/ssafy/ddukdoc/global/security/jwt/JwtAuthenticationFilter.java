package com.ssafy.ddukdoc.global.security.jwt;


import com.ssafy.ddukdoc.global.common.constants.SecurityConstants;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws IOException {

        String token = resolveToken(request);

        try {
            if (StringUtils.hasText(token)) {
                // 토큰 검증 결과 확인
                TokenValidationResult validationResult = jwtTokenProvider.validateToken(token);

                if (validationResult.isValid()) {
                    Authentication authentication = jwtTokenProvider.getAuthentication(token);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    // 토큰 오류 유형에 따른 응답
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json;charset=UTF-8");

                    String errorMsg = validationResult.error() == TokenError.EXPIRED
                            ? "{\"error\":\"token_expired\"}"
                            : "{\"error\":\"invalid_token\"}";

                    response.getWriter().write(errorMsg);
                    return;  // 필터 체인 중단
                }
            }
            //  5. 다음 필터로 이동
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            log.error("JWT 인증 처리 중 오류 발생", e);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"error\":\"authentication_failed\"}");
            // 필터 체인 계속 진행하지 않음
        }
    }

    private String resolveToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (SecurityConstants.ACCESS_TOKEN_COOKIE_NAME.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }

    // Swagger나 특정 경로에 대해 필터를 적용하지 않으려면 아래 메소드를 오버라이드
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/api/oauth");  // OAuth 관련 경로는 필터 제외
    }
}
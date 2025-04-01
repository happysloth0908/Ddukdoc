package com.ssafy.ddukdoc.domain.auth.controller;

import com.ssafy.ddukdoc.global.security.jwt.JwtTokenProvider;
import com.ssafy.ddukdoc.global.util.CookieUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dev")
@Profile({"dev","local"})
@RequiredArgsConstructor
@Tag(name = "개발 도구", description = "개발 환경에서만 사용 가능한 API")
public class DevToolController {

    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 테스트용 토큰 발급 API
     * 실제 프로덕션에서는 비활성화됨
     */
    @GetMapping("/token/{userId}")
    @Operation(summary = "테스트용 토큰 발급", description = "개발 환경에서만 사용 가능한 테스트용 토큰 발급 API입니다. 프로덕션 환경에서는 비활성화됩니다. \n\n 또는 `X-DEV-USER` 헤더에 `userId`를 넣어 인증이 필요한 api를 통과 가능")
    public ResponseEntity<Map<String, String>> getTestToken(@PathVariable Integer userId) {
        String accessToken = jwtTokenProvider.createAccessToken(userId.toString());
        String refreshToken = jwtTokenProvider.createRefreshToken(userId.toString());

        ResponseCookie accessTokenCookie = CookieUtil.makeDevAccessTokenCookie(accessToken);
        ResponseCookie refreshTokenCookie = CookieUtil.makeDevRefreshTokenCookie(refreshToken);

        Map<String, String> result = new HashMap<>();
        result.put("userId", userId.toString());
        result.put("accessToken", accessToken);
        result.put("refreshToken", refreshToken);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .body(result);
    }
}

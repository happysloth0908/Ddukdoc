package com.ssafy.ddukdoc.domain.auth.controller;

import com.ssafy.ddukdoc.global.security.jwt.JwtTokenProvider;
import com.ssafy.ddukdoc.global.util.CookieUtil;
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
public class DevToolController {

    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 테스트용 토큰 발급 API
     * 실제 프로덕션에서는 비활성화됨
     */
    @GetMapping("/token/{userId}")
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

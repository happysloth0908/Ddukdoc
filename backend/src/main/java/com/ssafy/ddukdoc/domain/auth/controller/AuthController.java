package com.ssafy.ddukdoc.domain.auth.controller;


import com.ssafy.ddukdoc.domain.auth.dto.LoginResult;
import com.ssafy.ddukdoc.domain.auth.dto.request.OAuthLoginRequest;
import com.ssafy.ddukdoc.domain.auth.dto.response.OAuthLoginResponse;
import com.ssafy.ddukdoc.domain.auth.service.OAuthService;
import com.ssafy.ddukdoc.domain.user.entity.constants.Provider;
import com.ssafy.ddukdoc.global.common.response.ApiResponse;
import com.ssafy.ddukdoc.global.util.CookieUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/oauth")
@RequiredArgsConstructor
public class AuthController {
    private final OAuthService oAuthService;

    @PostMapping("/{provider}")
    public ResponseEntity<ApiResponse<OAuthLoginResponse>> socialLogin(
            @PathVariable String provider,
            @RequestBody OAuthLoginRequest request) {
        LoginResult loginResult = oAuthService.handleOAuthLogin(Provider.valueOf(provider.toUpperCase()), request.getCode());

        // RefreshToken을 HttpOnly 쿠키로 설정
        ResponseCookie accessTokenCookie = CookieUtil.makeAccessTokenCookie(loginResult.getAccessToken());
        ResponseCookie refreshTokenCookie = CookieUtil.makeRefreshTokenCookie(loginResult.getRefreshToken());

        return ApiResponse.okWithCookie(loginResult.getResponse(), accessTokenCookie, refreshTokenCookie);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Void>> refreshToken(
            @CookieValue(name = "refresh_token", required = false) String refreshToken) {

        ResponseCookie accessTokenCookie = CookieUtil.makeAccessTokenCookie(oAuthService.refreshToken(refreshToken));

        return ApiResponse.okWithCookie(accessTokenCookie);
    }
}


package com.ssafy.ddukdoc.domain.auth.controller;


import com.ssafy.ddukdoc.domain.auth.dto.LoginResult;
import com.ssafy.ddukdoc.domain.auth.dto.response.OAuthLoginResponse;
import com.ssafy.ddukdoc.domain.auth.service.OAuthService;
import com.ssafy.ddukdoc.global.aop.swagger.ApiErrorCodeExamples;
import com.ssafy.ddukdoc.global.common.constants.Provider;
import com.ssafy.ddukdoc.global.common.response.CommonResponse;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.util.CookieUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/oauth")
@RequiredArgsConstructor
@Tag(name = "인증", description = "인증 & 인가 API")
public class AuthController {
    private final OAuthService oAuthService;

    @GetMapping("/{provider}/login")
    @Operation(summary = "소셜 로그인 처리", description = "소셜 로그인 인증 후 자동으로 호출되는 API입니다.\n\n이 API는 직접 호출하지 않으며, 소셜 로그인 과정에서 자동으로 호출됩니다.")
    @ApiErrorCodeExamples({ErrorCode.INVALID_OAUTH_PROVIDER, ErrorCode.OAUTH_SERVER_ERROR})
    public ResponseEntity<CommonResponse<OAuthLoginResponse>> socialLogin(
            @PathVariable String provider,
            @RequestParam String code,
            @Value("${app.domain.url}") String domainUrl
    ) {
        LoginResult loginResult = oAuthService.handleOAuthLogin(Provider.valueOf(provider.toUpperCase()), code);

        ResponseCookie accessTokenCookie = CookieUtil.makeAccessTokenCookie(loginResult.getAccessToken());
        ResponseCookie refreshTokenCookie = CookieUtil.makeRefreshTokenCookie(loginResult.getRefreshToken());

        return CommonResponse.redirectWithCookie(domainUrl, accessTokenCookie, refreshTokenCookie);
    }

    @PostMapping("/refresh")
    @Operation(summary = "토큰 갱신", description = "리프레시 토큰을 사용하여 액세스 토큰을 갱신합니다.")
    public ResponseEntity<CommonResponse<Void>> refreshToken(
            @CookieValue(name = "refresh_token", required = false) String refreshToken) {

        ResponseCookie accessTokenCookie = CookieUtil.makeAccessTokenCookie(oAuthService.refreshToken(refreshToken));

        return CommonResponse.okWithCookie(accessTokenCookie);
    }
}
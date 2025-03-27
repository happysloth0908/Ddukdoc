package com.ssafy.ddukdoc.domain.user.controller;

import com.ssafy.ddukdoc.domain.auth.service.AuthRedisService;
import com.ssafy.ddukdoc.domain.user.service.UserService;
import com.ssafy.ddukdoc.global.common.response.ApiResponse;
import com.ssafy.ddukdoc.global.security.auth.UserPrincipal;
import com.ssafy.ddukdoc.global.util.AuthenticationUtil;
import com.ssafy.ddukdoc.global.util.CookieUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final AuthRedisService authRedisService;
    private final AuthenticationUtil authenticationUtil;

    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> logout(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        authRedisService.deleteRefreshToken(String.valueOf(userId));

        ResponseCookie deletedAccessTokenCookie = CookieUtil.deleteAccessTokenCookie();
        ResponseCookie deletedRefreshTokenCookie = CookieUtil.deleteRefreshTokenCookie();

        return ApiResponse.okWithCookie(deletedAccessTokenCookie, deletedRefreshTokenCookie);
    }

    @PatchMapping("/leave")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> withdraw(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        userService.withdrawUser(userId);
        authRedisService.deleteRefreshToken(String.valueOf(userId));

        ResponseCookie deletedAccessTokenCookie = CookieUtil.deleteAccessTokenCookie();
        ResponseCookie deletedRefreshTokenCookie = CookieUtil.deleteRefreshTokenCookie();

        return ApiResponse.okWithCookie(deletedAccessTokenCookie, deletedRefreshTokenCookie);
    }
}
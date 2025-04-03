package com.ssafy.ddukdoc.domain.user.controller;

import com.ssafy.ddukdoc.domain.auth.service.AuthRedisService;
import com.ssafy.ddukdoc.domain.user.service.UserService;
import com.ssafy.ddukdoc.global.aop.swagger.ApiErrorCodeExamples;
import com.ssafy.ddukdoc.global.common.response.CommonResponse;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.security.auth.UserPrincipal;
import com.ssafy.ddukdoc.global.util.AuthenticationUtil;
import com.ssafy.ddukdoc.global.util.CookieUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "사용자", description = "사용자 관련 API")
public class UserController {
    private final UserService userService;
    private final AuthRedisService authRedisService;
    private final AuthenticationUtil authenticationUtil;

    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "로그아웃", description = "사용자 로그아웃 처리를 수행합니다. \n\n 쿠키에 저장된 토큰을 삭제합니다. \n\n 개발자용 토큰 쿠키는 삭제되지 않습니다.")
    public ResponseEntity<CommonResponse<Void>> logout(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        authRedisService.deleteRefreshToken(String.valueOf(userId));

        ResponseCookie deletedAccessTokenCookie = CookieUtil.deleteAccessTokenCookie();
        ResponseCookie deletedRefreshTokenCookie = CookieUtil.deleteRefreshTokenCookie();

        return CommonResponse.okWithCookie(deletedAccessTokenCookie, deletedRefreshTokenCookie);
    }

    @PatchMapping("/leave")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "회원 탈퇴", description = "사용자 회원 탈퇴 처리를 수행합니다.")
    @ApiErrorCodeExamples({ErrorCode.INVALID_USER_ID})
    public ResponseEntity<CommonResponse<Void>> withdraw(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        userService.withdrawUser(userId);
        authRedisService.deleteRefreshToken(String.valueOf(userId));

        ResponseCookie deletedAccessTokenCookie = CookieUtil.deleteAccessTokenCookie();
        ResponseCookie deletedRefreshTokenCookie = CookieUtil.deleteRefreshTokenCookie();

        return CommonResponse.okWithCookie(deletedAccessTokenCookie, deletedRefreshTokenCookie);
    }

    @GetMapping("/status")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "로그인 상태 확인", description = "로그인 상태를 확인합니다. 없으면 401")
    @ApiErrorCodeExamples({ErrorCode.UNAUTHORIZED_ACCESS})
    public ResponseEntity<CommonResponse<Void>> checkLoginStatus() {
        return CommonResponse.ok();
    }
}
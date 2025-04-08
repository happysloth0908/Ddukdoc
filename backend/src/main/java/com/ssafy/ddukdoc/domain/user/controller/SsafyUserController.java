package com.ssafy.ddukdoc.domain.user.controller;

import com.ssafy.ddukdoc.domain.user.dto.response.SsafyUserInfoResponse;
import com.ssafy.ddukdoc.domain.user.service.SsafyUserService;
import com.ssafy.ddukdoc.global.aop.SSAFYAccess;
import com.ssafy.ddukdoc.global.aop.swagger.ApiErrorCodeExamples;
import com.ssafy.ddukdoc.global.common.response.CommonResponse;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.security.auth.UserPrincipal;
import com.ssafy.ddukdoc.global.util.AuthenticationUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ssafy/users")
@RequiredArgsConstructor
@Tag(name = "SSAFY 사용자", description = "SSAFY 사용자 관련 API")
public class SsafyUserController {

    private final SsafyUserService ssafyUserService;
    private final AuthenticationUtil authenticationUtil;

    @GetMapping("/info")
    @SSAFYAccess
    @Operation(summary = "SSAFY 사용자 정보 확인", description = "사용자 정보를 반환합니다.")
    @ApiErrorCodeExamples({ErrorCode.INVALID_USER_ID, ErrorCode.EXTERNAL_API_ERROR, ErrorCode.INVALID_INPUT_VALUE, ErrorCode.INTERNAL_SERVER_ERROR})
    public ResponseEntity<CommonResponse<SsafyUserInfoResponse>> SsafyUserInfo(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        return CommonResponse.ok(ssafyUserService.getUserInfo(userId));
    }
}

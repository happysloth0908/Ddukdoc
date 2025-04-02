package com.ssafy.ddukdoc.domain.share.controller;

import com.ssafy.ddukdoc.domain.share.dto.request.MMLoginRequest;
import com.ssafy.ddukdoc.domain.share.dto.response.MMLoginResponse;
import com.ssafy.ddukdoc.domain.share.service.ShareService;
import com.ssafy.ddukdoc.global.aop.swagger.ApiErrorCodeExamples;
import com.ssafy.ddukdoc.global.common.response.CommonResponse;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/share")
@Tag(name = "공유하기", description = "공유(MatterMost 등)관련 로그인, 팀 조회 등 각종 API")
public class ShareController {

    private final ShareService shareService;

    @PostMapping("/mm/login")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "MM 로그인", description = "id와 password를 통해 SSAFY MatterMost에 로그인합니다.")
    @ApiErrorCodeExamples({ErrorCode.INVALID_INPUT_VALUE})
    public ResponseEntity<CommonResponse<MMLoginResponse>> mattermostLogin(
            @RequestBody MMLoginRequest loginRequest) {

        return CommonResponse.ok(shareService.mattermostLogin(loginRequest));
    }
}

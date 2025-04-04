package com.ssafy.ddukdoc.domain.verification.controller;

import com.ssafy.ddukdoc.domain.verification.service.VerificationService;
import com.ssafy.ddukdoc.global.aop.swagger.ApiErrorCodeExamples;
import com.ssafy.ddukdoc.global.common.response.CommonResponse;
import com.ssafy.ddukdoc.global.security.auth.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/verification")
@Tag(name="위변조 검증", description = "문서 위변조 검증 API")
public class VerificationController {

    private final VerificationService verificationService;

    // 위변조 검증
    @PostMapping("")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "일반 문서 위변조 검증", description = "일반 문서의 위변조를 검증합니다")
    @ApiErrorCodeExamples({})
    public ResponseEntity<CommonResponse<Void>> verificationDocument(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestPart("file") MultipartFile file) {

        return CommonResponse.ok();
    }

}

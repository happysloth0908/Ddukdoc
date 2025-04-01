package com.ssafy.ddukdoc.domain.document.controller;

import com.amazonaws.Response;
import com.ssafy.ddukdoc.domain.document.dto.request.SsafyDocumentSearchRequestDto;
import com.ssafy.ddukdoc.domain.document.dto.response.SsafyDocumentResponseDto;
import com.ssafy.ddukdoc.domain.document.service.SsafyDocumentService;
import com.ssafy.ddukdoc.global.aop.swagger.ApiErrorCodeExamples;
import com.ssafy.ddukdoc.global.common.CustomPage;
import com.ssafy.ddukdoc.global.common.response.CommonResponse;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.security.auth.UserPrincipal;
import com.ssafy.ddukdoc.global.util.AuthenticationUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ssafy/docs")
@Tag(name = "싸피 문서 관리", description = "SSAFY 문서 조회, 수정 등의 API")
public class SsafyDocsController {

    private final AuthenticationUtil authenticationUtil;
    private final SsafyDocumentService ssafyDocumentService;

    @GetMapping("")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "싸피 문서 목록 조회", description = "싸피 사용자가 접근 가능한 문서 목록을 조회합니다  \n\n **각 필드는 필수값이 아닙니다!** \n\n sort: asc / desc")
    @ApiErrorCodeExamples({ErrorCode.INVALID_INPUT_VALUE})
    public ResponseEntity<CommonResponse<CustomPage<SsafyDocumentResponseDto>>> getDocsList (
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @ModelAttribute SsafyDocumentSearchRequestDto ssafyDocumentSearchRequestDto,
            @PageableDefault(sort = "createAt",direction = Sort.Direction.DESC) Pageable pageable){

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        return CommonResponse.ok(ssafyDocumentService.getDocsList(userId, ssafyDocumentSearchRequestDto, pageable));
    }

}

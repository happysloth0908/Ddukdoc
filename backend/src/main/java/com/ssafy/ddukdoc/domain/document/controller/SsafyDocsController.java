package com.ssafy.ddukdoc.domain.document.controller;

import com.ssafy.ddukdoc.domain.document.dto.request.SsafyDocumentSearchRequestDto;
import com.ssafy.ddukdoc.domain.document.dto.response.DocumentDownloadResponseDto;
import com.ssafy.ddukdoc.domain.document.dto.response.SsafyDocumentDetailResponseDto;
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
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;

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
    public ResponseEntity<CommonResponse<CustomPage<SsafyDocumentResponseDto>>> getDocsList(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @ModelAttribute SsafyDocumentSearchRequestDto ssafyDocumentSearchRequestDto,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        return CommonResponse.ok(ssafyDocumentService.getDocsList(userId, ssafyDocumentSearchRequestDto, pageable));
    }

    @GetMapping("/{doc_id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary="싸피 문서 상세 조회", description = "doc_id를 통한 싸피 상세 문서를 조회합니다")
    @ApiErrorCodeExamples({ErrorCode.DOCUMENT_NOT_FOUND, ErrorCode.CREATOR_NOT_MATCH, ErrorCode.SIGNATURE_FILE_NOT_FOUND, ErrorCode.FILE_DOWNLOAD_ERROR})
    public ResponseEntity<CommonResponse<SsafyDocumentDetailResponseDto>> getSsafyDocumentDetail(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("doc_id") Integer documentId){

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        return CommonResponse.ok(ssafyDocumentService.getSsafyDocumentDetail(userId, documentId));
    }

    @GetMapping("/{doc_id}/download")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "싸피 문서 다운로드", description = "doc_id를 통한 싸피 문서를 다운로드합니다")
    @ApiErrorCodeExamples({ErrorCode.DOCUMENT_NOT_FOUND, ErrorCode.CREATOR_NOT_MATCH, ErrorCode.FILE_DOWNLOAD_ERROR})
    public ResponseEntity<byte[]> downloadSsafyDocument(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("doc_id") Integer documentId){

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        DocumentDownloadResponseDto downloadResponseDto = ssafyDocumentService.downloadSsafyDocument(userId, documentId);
        String fileName = UriUtils.encode(downloadResponseDto.getDocumentTitle()+".pdf", StandardCharsets.UTF_8);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename(fileName)
                .build());

        return new ResponseEntity<>(downloadResponseDto.getDocumentContent(), headers, HttpStatus.OK);
    }

}

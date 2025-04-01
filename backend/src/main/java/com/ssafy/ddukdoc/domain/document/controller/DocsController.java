package com.ssafy.ddukdoc.domain.document.controller;

import com.ssafy.ddukdoc.domain.document.dto.request.DocumentSearchRequestDto;
import com.ssafy.ddukdoc.domain.document.dto.request.PinCodeRequestDto;
import com.ssafy.ddukdoc.domain.document.dto.response.DocumentDetailResponseDto;
import com.ssafy.ddukdoc.domain.document.dto.response.DocumentListResponseDto;
import com.ssafy.ddukdoc.domain.document.service.DocumentService;
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
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/docs")
@Tag(name = "문서 관리", description = "문서 조회, 삭제, 핀코드 검증 등의 API")
public class DocsController {

    private final DocumentService documentService;
    private final AuthenticationUtil authenticationUtil;


    @GetMapping("")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "문서 목록 조회", description = "사용자가 접근 가능한 문서 목록을 조회합니다.  \n\n **각 필드는 필수값이 아닙니다!** \n\n sort: asc / desc")
    @ApiErrorCodeExamples({ErrorCode.INVALID_INPUT_VALUE})
    public ResponseEntity<CommonResponse<CustomPage<DocumentListResponseDto>>> getDocsList(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @ModelAttribute DocumentSearchRequestDto documentSearchRequestDto,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        return CommonResponse.ok(documentService.getDocumentList(userId, documentSearchRequestDto, pageable));
    }

    @GetMapping("/{doc_id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "문서 상세 조회", description = "doc_id를 통한 상세 문서를 조회합니다.")
    @ApiErrorCodeExamples({ErrorCode.DOCUMENT_NOT_FOUND})
    public ResponseEntity<CommonResponse<DocumentDetailResponseDto>> getDoc(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("doc_id") Integer documentId) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        return CommonResponse.ok(documentService.getDocumentDetail(userId, documentId));
    }

    // 문서 삭제
    @PatchMapping("/{doc_id}/delete")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "문서 삭제", description = "문서를 삭제 처리합니다.")
    @ApiErrorCodeExamples({ErrorCode.DOCUMENT_NOT_FOUND, ErrorCode.CREATOR_NOT_MATCH, ErrorCode.DOCUMENT_NOT_RETURNED})
    public ResponseEntity<CommonResponse<Void>> deleteDoc(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("doc_id") Integer documentId) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        documentService.deleteDocument(userId, documentId);
        return CommonResponse.ok();
    }

    // 핀번호 입력
    @PostMapping("/{doc_id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = " 핀번호 입력", description = "핀번호 입력 성공 여부")
    @ApiErrorCodeExamples({ErrorCode.DOCUMENT_NOT_FOUND, ErrorCode.PIN_CODE_MISMATCH, ErrorCode.INVALID_USER_ID, ErrorCode.USER_DOC_ROLE_NOT_FOUND, ErrorCode.ROLE_NOT_FOUND})
    public ResponseEntity<CommonResponse<Void>> verifyPincode(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("doc_id") Integer documentId,
            @Valid @RequestBody PinCodeRequestDto pinCodeRequestDto) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        documentService.verifyPinCode(userId, documentId, pinCodeRequestDto.getPinCode());
        return CommonResponse.ok();
    }
}

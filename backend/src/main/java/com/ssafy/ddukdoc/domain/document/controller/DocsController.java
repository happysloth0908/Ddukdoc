package com.ssafy.ddukdoc.domain.document.controller;

import com.ssafy.ddukdoc.domain.document.dto.request.DocumentSearchRequestDto;
import com.ssafy.ddukdoc.domain.document.dto.request.PinCodeRequestDto;
import com.ssafy.ddukdoc.domain.document.dto.response.DocumentDetailResponseDto;
import com.ssafy.ddukdoc.domain.document.dto.response.DocumentListResponseDto;
import com.ssafy.ddukdoc.domain.document.service.DocumentService;
import com.ssafy.ddukdoc.global.common.CustomPage;
import com.ssafy.ddukdoc.global.common.response.ApiResponse;
import com.ssafy.ddukdoc.global.security.auth.UserPrincipal;
import com.ssafy.ddukdoc.global.util.AuthenticationUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/docs")
public class DocsController {

    private final DocumentService documentService;
    private final AuthenticationUtil authenticationUtil;

    // 문서 목록 조회
    @GetMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CustomPage<DocumentListResponseDto>>> getDocsList(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @ModelAttribute DocumentSearchRequestDto documentSearchRequestDto,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Auth: " + auth + ", isAuthenticated: " + (auth != null && auth.isAuthenticated()));

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        return ApiResponse.ok(documentService.getDocumentList(userId, documentSearchRequestDto, pageable));
    }

    // 문서 상세 조회
    @GetMapping("/{doc_id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<DocumentDetailResponseDto>> getDoc(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("doc_id") Integer documentId) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        return ApiResponse.ok(documentService.getDocumentDetail(userId, documentId));
    }

    // 문서 삭제
    @PatchMapping("/{doc_id}/delete")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteDoc(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("doc_id") Integer documentId) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        documentService.deleteDocument(userId, documentId);
        return ApiResponse.ok(null);
    }

    // 핀번호 입력
    @PostMapping("/{doc_id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> verifyPincode(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("doc_id") Integer documentId,
            @Valid @RequestBody PinCodeRequestDto pinCodeRequestDto) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        documentService.verifyPinCode(userId, documentId, pinCodeRequestDto.getPinCode());
        return ApiResponse.ok(null);
    }
}

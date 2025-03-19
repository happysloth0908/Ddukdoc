package com.ssafy.ddukdoc.domain.document.controller;

import com.ssafy.ddukdoc.domain.document.dto.request.DocumentSearchRequestDto;
import com.ssafy.ddukdoc.domain.document.dto.response.DocumentListResponseDto;
import com.ssafy.ddukdoc.domain.document.service.DocumentService;
import com.ssafy.ddukdoc.global.common.response.ApiResponse;
import com.ssafy.ddukdoc.global.security.auth.UserPrincipal;
import com.ssafy.ddukdoc.global.util.AuthenticationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/docs")
public class DocsController {

    private final DocumentService documentService;
    private final AuthenticationUtil authenticationUtil;

    // 문서 목록 조회
    @GetMapping("")
    public ResponseEntity<ApiResponse<DocumentListResponseDto>> getDocsList(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(value = "send_receive_status", required = true) Integer sendReceiveStatus,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "template_code", required = false) String templateCode,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "created_at", required = false) LocalDateTime createdAt,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable){

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        DocumentSearchRequestDto documentSearchRequestDto = DocumentSearchRequestDto.builder()
                .sendReceiveStatus(sendReceiveStatus)
                .page(page)
                .templateCode(templateCode)
                .keyword(keyword)
                .status(status)
                .createdAt(createdAt)
                .build();

        return ApiResponse.ok(documentService.getDocumentList(userId, documentSearchRequestDto, pageable));
    }

    // 문서 상세 조회
    @GetMapping("/{doc_id}")
    public ResponseEntity<ApiResponse<Void>> getDoc(@PathVariable("doc_id") Long docId){
        return ApiResponse.success(HttpStatus.NO_CONTENT);
    }
}

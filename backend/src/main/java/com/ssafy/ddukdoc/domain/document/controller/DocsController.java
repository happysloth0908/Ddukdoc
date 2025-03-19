package com.ssafy.ddukdoc.domain.document.controller;

import com.ssafy.ddukdoc.domain.document.dto.request.DocumentSearchRequestDto;
import com.ssafy.ddukdoc.domain.document.dto.response.DocumentListResponseDto;
import com.ssafy.ddukdoc.domain.document.service.DocumentService;
import com.ssafy.ddukdoc.global.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/docs")
public class DocsController {

    private DocumentService documentService;

    // 문서 목록 조회
    @GetMapping("")
    public ResponseEntity<ApiResponse<DocumentListResponseDto>> getDocsList(
            @RequestParam(value = "send_receive_status", required = true) Integer sendReceiveStatus,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "template_code", required = false) String templateCode,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "created_at", required = false) LocalDateTime createdAt,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable){

        DocumentSearchRequestDto documentSearchRequestDto = new DocumentSearchRequestDto(sendReceiveStatus, page, templateCode, keyword, status, createdAt);
        DocumentListResponseDto response = documentService.getDocumentList(documentSearchRequestDto, pageable);
        return ApiResponse.success(response);
    }

    // 문서 상세 조회
    @GetMapping("/{doc_id}")
    public ResponseEntity<ApiResponse<Void>> getDoc(@PathVariable("doc_id") Long docId){
        return ApiResponse.success(HttpStatus.NO_CONTENT);
    }
}

package com.ssafy.ddukdoc.domain.document.controller;

import com.ssafy.ddukdoc.domain.document.dto.response.DocumentListResponse;
import com.ssafy.ddukdoc.domain.document.service.DocumentService;
import com.ssafy.ddukdoc.global.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/docs")
public class DocsController {

    private DocumentService documentService;

    // 문서 목록 조회
    @GetMapping("")
    public ResponseEntity<ApiResponse<DocumentListResponse>> getDocsList(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "templateCode", required = false) String templateCode,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "createdAt", required = false) String createdAt){

        DocumentListResponse response = documentService.getDocumentList();
        return ApiResponse.success(response);
    }

    // 문서 상세 조회
    @GetMapping("/{doc_id}")
    public ResponseEntity<ApiResponse<Void>> getDoc(@PathVariable("doc_id") Long docId){
        return ApiResponse.success(HttpStatus.NO_CONTENT);
    }
}

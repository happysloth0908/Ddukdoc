package com.ssafy.ddukdoc.domain.material.controller;

import com.ssafy.ddukdoc.domain.material.service.MaterialService;
import com.ssafy.ddukdoc.global.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/material")
public class MaterialController {

    private final MaterialService materialService;

    // 기타 자료 추가
    @PostMapping(value = "/{doc_id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> uploadMaterial(
            @PathVariable("doc_id") Integer documentId,
            @RequestPart("title") String title,
            @RequestPart("file")MultipartFile file){

        materialService.uploadMaterial(documentId, title, file);
        return ApiResponse.ok(null);
    }
}

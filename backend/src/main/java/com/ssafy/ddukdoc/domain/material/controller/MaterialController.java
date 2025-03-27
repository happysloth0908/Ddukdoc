package com.ssafy.ddukdoc.domain.material.controller;

import com.ssafy.ddukdoc.domain.material.service.MaterialService;
import com.ssafy.ddukdoc.global.common.response.ApiResponse;
import com.ssafy.ddukdoc.global.security.auth.UserPrincipal;
import com.ssafy.ddukdoc.global.util.AuthenticationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/material")
public class MaterialController {

    private final MaterialService materialService;
    private final AuthenticationUtil authenticationUtil;

    // 기타 자료 추가
    @PostMapping(value = "/{doc_id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> uploadMaterial(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("doc_id") Integer documentId,
            @RequestPart("title") String title,
            @RequestPart("file") MultipartFile file){

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        materialService.uploadMaterial(userId, documentId, title, file);
        return ApiResponse.ok();
    }
}

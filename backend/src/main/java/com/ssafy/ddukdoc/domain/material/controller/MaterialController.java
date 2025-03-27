package com.ssafy.ddukdoc.domain.material.controller;

import com.ssafy.ddukdoc.domain.material.dto.response.MaterialDetailResponseDto;
import com.ssafy.ddukdoc.domain.material.dto.response.MaterialListResponseDto;
import com.ssafy.ddukdoc.domain.material.service.MaterialService;
import com.ssafy.ddukdoc.global.common.response.ApiResponse;
import com.ssafy.ddukdoc.global.security.auth.UserPrincipal;
import com.ssafy.ddukdoc.global.util.AuthenticationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/material")
public class MaterialController {

    private final MaterialService materialService;
    private final AuthenticationUtil authenticationUtil;

    // 기타 자료 추가
    @PostMapping(value = "/{doc_id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> uploadMaterial(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("doc_id") Integer documentId,
            @RequestPart("title") String title,
            @RequestPart("file") MultipartFile file){

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        materialService.uploadMaterial(userId, documentId, title, file);
        return ApiResponse.ok();
    }

    // 기타 자료 조회
    @GetMapping("/{doc_id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<MaterialListResponseDto>>> getMaterialList(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("doc_id") Integer documentId){

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        return ApiResponse.ok(materialService.getMaterialList(userId, documentId));
    }

    // 기타 자료 상세 조회
    @GetMapping("/{doc_id}/{material_id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<MaterialDetailResponseDto>> getMaterialDetail(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("doc_id") Integer documentId,
            @PathVariable("material_id") Integer materialId){

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        return ApiResponse.ok(materialService.getMaterialDetail(userId, documentId, materialId));
    }

}

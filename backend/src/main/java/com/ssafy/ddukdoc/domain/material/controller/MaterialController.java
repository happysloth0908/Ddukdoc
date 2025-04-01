package com.ssafy.ddukdoc.domain.material.controller;

import com.ssafy.ddukdoc.domain.material.dto.response.MaterialDetailResponseDto;
import com.ssafy.ddukdoc.domain.material.dto.response.MaterialDownloadResponseDto;
import com.ssafy.ddukdoc.domain.material.dto.response.MaterialListResponseDto;
import com.ssafy.ddukdoc.domain.material.service.MaterialService;
import com.ssafy.ddukdoc.global.aop.swagger.ApiErrorCodeExamples;
import com.ssafy.ddukdoc.global.common.response.CommonResponse;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.security.auth.UserPrincipal;
import com.ssafy.ddukdoc.global.util.AuthenticationUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/material")
@Tag(name = "기타 자료", description = "문서 관련 기타 자료 API")
public class MaterialController {

    private final MaterialService materialService;
    private final AuthenticationUtil authenticationUtil;

    // 기타 자료 추가
    @PostMapping(value = "/{doc_id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "기타 자료 업로드", description = "문서에 기타 자료를 업로드합니다.")
    @ApiErrorCodeExamples({ErrorCode.DOCUMENT_NOT_FOUND, ErrorCode.INVALID_USER_ID, ErrorCode.MATERIAL_UPLOAD_ERROR, ErrorCode.MATERIAL_SIZE_EXCEEDED, ErrorCode.MATERIAL_INVALID_FORMAT, ErrorCode.FILE_UPLOAD_ERROR})
    public ResponseEntity<CommonResponse<Void>> uploadMaterial(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("doc_id") Integer documentId,
            @RequestPart("title") String title,
            @RequestPart("file") MultipartFile file) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        materialService.uploadMaterial(userId, documentId, title, file);
        return CommonResponse.ok();
    }

    // 기타 자료 조회
    @GetMapping("/{doc_id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "기타 자료 목록 조회", description = "문서의 기타 자료 목록을 조회합니다.")
    @ApiErrorCodeExamples({ErrorCode.DOCUMENT_NOT_FOUND, ErrorCode.FORBIDDEN_ACCESS})
    public ResponseEntity<CommonResponse<List<MaterialListResponseDto>>> getMaterialList(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("doc_id") Integer documentId) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        return CommonResponse.ok(materialService.getMaterialList(userId, documentId));
    }

    // 기타 자료 상세 조회
    @GetMapping("/{doc_id}/{material_id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "기타 자료 상세 조회", description = "문서에 첨부된 기타 자료의 상세 정보를 조회합니다.")
    @ApiErrorCodeExamples({ErrorCode.DOCUMENT_NOT_FOUND, ErrorCode.FORBIDDEN_ACCESS, ErrorCode.MATERIAL_NOT_FOUND, ErrorCode.MATERIAL_NOT_IMAGE, ErrorCode.FILE_DOWNLOAD_ERROR})
    public ResponseEntity<CommonResponse<MaterialDetailResponseDto>> getMaterialDetail(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("doc_id") Integer documentId,
            @PathVariable("material_id") Integer materialId) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        return CommonResponse.ok(materialService.getMaterialDetail(userId, documentId, materialId));
    }

    // 기타 자료 삭제
    @DeleteMapping("/{doc_id}/{material_id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "기타 자료 삭제", description = "문서에 첨부된 기타 자료를 삭제합니다.")
    @ApiErrorCodeExamples({ErrorCode.DOCUMENT_NOT_FOUND, ErrorCode.FORBIDDEN_ACCESS, ErrorCode.MATERIAL_NOT_FOUND, ErrorCode.FORBIDDEN_ACCESS, ErrorCode.FILE_DELETE_ERROR})
    public ResponseEntity<CommonResponse<Void>> deleteMaterial(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("doc_id") Integer documentId,
            @PathVariable("material_id") Integer materialId) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        materialService.deleteMaterial(userId, documentId, materialId);
        return CommonResponse.ok();
    }

    // 기타 자료 다운로드
    @GetMapping("/{doc_id}/download")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "기타 자료 다운로드", description = "문서에 첨부된 기타 자료들을 zip 파일로 다운로드합니다.")
    @ApiErrorCodeExamples({ErrorCode.DOCUMENT_NOT_FOUND, ErrorCode.FORBIDDEN_ACCESS, ErrorCode.MATERIAL_DOWNLOAD_ERROR, ErrorCode.MATERIAL_ZIP_CONVERT_ERROR, ErrorCode.FILE_DOWNLOAD_ERROR})
    public ResponseEntity<byte[]> downloadMaterial(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("doc_id") Integer documentId) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        MaterialDownloadResponseDto materialDownloadResponseDto = materialService.downloadMaterial(userId, documentId);
        String fileName = UriUtils.encode(materialDownloadResponseDto.getFileTitle() + ".zip", StandardCharsets.UTF_8);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.valueOf("application/zip"));
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename(fileName)
                .build()
        );
        return new ResponseEntity<>(materialDownloadResponseDto.getZipBytes(), headers, HttpStatus.OK);
    }

}

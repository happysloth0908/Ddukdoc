package com.ssafy.ddukdoc.superapp.controller;

import com.ssafy.ddukdoc.global.aop.swagger.ApiErrorCodeExamples;
import com.ssafy.ddukdoc.global.common.response.CommonResponse;
import com.ssafy.ddukdoc.superapp.service.OpenApiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "SSAFY SUPERAPP API", description = "SSAFY SUPERAPP에 제공될  OpenAPI 목록")
public class OpenApiController {

    private final OpenApiService openApiService;

    @PostMapping(value = "/register", produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "파일 등록", description = "")
    @ApiErrorCodeExamples({})
    public ResponseEntity<CommonResponse<Void>> registerFile() {
        return CommonResponse.ok();
    }

    @PostMapping(value = "/validation", produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "위변조 검증", description = "등록한 파일의 메타데이터를 조회해 위변조 검증을 합니다")
    @ApiErrorCodeExamples({})
    public ResponseEntity<CommonResponse<Void>> validateFile() {
        return CommonResponse.ok();
    }

}

package com.ssafy.ddukdoc.superapp.controller;

import com.ssafy.ddukdoc.global.aop.swagger.ApiErrorCodeExamples;
import com.ssafy.ddukdoc.global.common.response.CommonResponse;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.superapp.dto.response.FileRegisterResultDto;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.superapp.service.OpenApiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "SSAFY SUPERAPP API", description = "SSAFY SUPERAPP에 제공될  OpenAPI 목록")
public class OpenApiController {

    private final OpenApiService openApiService;

    @PostMapping(value = "/register",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "파일 등록", description = "파일 메타데이터에 값을 추가하고 그 파일에 대한 해시값을 블록체인에 저장합니다.")
    @ApiErrorCodeExamples({ErrorCode.MATERIAL_UPLOAD_ERROR, ErrorCode.BLOCKCHAIN_SAVE_ERROR,ErrorCode.MATERIAL_INVALID_FORMAT,ErrorCode.FILE_IS_EMPTY})
    public ResponseEntity<CommonResponse<FileRegisterResultDto>> registerFile(
            @Parameter(description = "업로드할 파일(빈 파일 전송 불가)")
            @RequestPart(value = "file") MultipartFile file) {
        FileRegisterResultDto responseDto = openApiService.registerFile(file);

//        // 응답 헤더 설정
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(responseDto.getMediaType());
//
//        // 다운로드 설정 (파일명 인코딩)
//        String encodedFileName = UriUtils.encode(responseDto.getFileName(), StandardCharsets.UTF_8);
//        headers.setContentDisposition(ContentDisposition.attachment()
//                .filename(encodedFileName)
//                .build());

        return CommonResponse.ok(responseDto);
    }

    @PostMapping(value = "/validation")
    @Operation(summary = "위변조 검증", description = "등록한 파일의 메타데이터를 조회해 위변조 검증을 합니다")
    @ApiErrorCodeExamples({ErrorCode.MATERIAL_UPLOAD_ERROR, ErrorCode.VALIDATION_NOT_REGIST, ErrorCode.VALIDATION_NOT_MATCH, ErrorCode.VALIDATION_ERROR
            , ErrorCode.MATERIAL_INVALID_FORMAT, ErrorCode.PNG_READER_NOT_FOUND, ErrorCode.BLOCKCHAIN_DOCUMENT_ERROR, ErrorCode.INVALID_ENCRYPTION_ALGORITHM})
    public ResponseEntity<CommonResponse<Void>> validateFile(@RequestPart("file") MultipartFile multipartFile) {
        openApiService.validationFile(multipartFile);
        return CommonResponse.ok();
    }

}

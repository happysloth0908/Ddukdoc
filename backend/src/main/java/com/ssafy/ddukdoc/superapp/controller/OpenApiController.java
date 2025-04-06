package com.ssafy.ddukdoc.superapp.controller;

import com.ssafy.ddukdoc.global.aop.swagger.ApiErrorCodeExamples;
import com.ssafy.ddukdoc.global.common.response.CommonResponse;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.superapp.dto.response.FileRegisterResultDto;
import com.ssafy.ddukdoc.superapp.service.OpenApiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    public ResponseEntity<byte[]> registerFile(
            @RequestPart(value = "file") MultipartFile file) {
        FileRegisterResultDto responseDto = openApiService.registerFile(file);
        // 응답 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        MediaType mediaType = determineMediaType(responseDto.getFileName());
        headers.setContentType(mediaType);

        // 다운로드 설정 (파일명 인코딩)
        String encodedFileName = UriUtils.encode(responseDto.getFileName(), StandardCharsets.UTF_8);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename(encodedFileName)
                .build());

        // 바이트 배열 직접 반환
        return new ResponseEntity<>(responseDto.getFileContent(), headers, HttpStatus.OK);
    }

    private MediaType determineMediaType(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
        String extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

        switch (extension) {
            case "pdf":
                return MediaType.APPLICATION_PDF;
            case "doc":
            case "docx":
                return MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            case "png":
                return MediaType.IMAGE_PNG;
            case "jpg":
            case "jpeg":
                return MediaType.IMAGE_JPEG;
            default:
                return MediaType.APPLICATION_OCTET_STREAM; // 기본 바이너리 타입
        }
    }

    @PostMapping(value = "/validation", produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "위변조 검증", description = "")
    @ApiErrorCodeExamples({})
    public ResponseEntity<CommonResponse<Void>> validateFile() {
        return CommonResponse.ok();
    }

}

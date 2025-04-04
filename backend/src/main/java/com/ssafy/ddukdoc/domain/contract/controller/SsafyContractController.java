package com.ssafy.ddukdoc.domain.contract.controller;

import com.ssafy.ddukdoc.domain.contract.service.SsafyContractService;
import com.ssafy.ddukdoc.domain.document.dto.request.DocumentSaveRequestDto;
import com.ssafy.ddukdoc.domain.template.dto.response.TemplateFieldResponseDto;
import com.ssafy.ddukdoc.global.aop.swagger.ApiErrorCodeExamples;
import com.ssafy.ddukdoc.global.common.response.CommonResponse;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.security.auth.UserPrincipal;
import com.ssafy.ddukdoc.global.util.AuthenticationUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/ssafy/contract")
@RequiredArgsConstructor
@Tag(name = "싸피 계약 관리", description = "싸피 계약/템플릿 관련 API")
public class SsafyContractController {
    private final SsafyContractService ssafyContractService;
    private final AuthenticationUtil authenticationUtil;

    @GetMapping("/{templateCode}")
    @Operation(summary = "템플릿 필드 목록 조회", description = "템플릿 코드에 해당하는 필드 목록을 조회합니다.")
    @ApiErrorCodeExamples({ErrorCode.TEMPLATE_NOT_FOUND})
    public ResponseEntity<CommonResponse<List<TemplateFieldResponseDto>>> getFieldList(@PathVariable String templateCode){
        return CommonResponse.ok(ssafyContractService.getTemplateFields(templateCode));
    }

    @PostMapping(value = "/{templateCode}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "싸피 문서 저장", description = "템플릿 코드에 해당하는 문서를 저장합니다. \n\n문서 ID를 return 합니다.")
    @ApiErrorCodeExamples({ErrorCode.SIGNATURE_FILE_NOT_FOUND, ErrorCode.INVALID_USER_ID, ErrorCode.TEMPLATE_NOT_FOUND, ErrorCode.TEMPLATE_FIELD_NOT_FOUND, ErrorCode.INVALID_USER_ID, ErrorCode.FORBIDDEN_ACCESS, ErrorCode.FILE_UPLOAD_ERROR, ErrorCode.INVALID_INPUT_VALUE,ErrorCode.TEMPLATE_NOT_MATCH})
    public ResponseEntity<CommonResponse<Integer>> saveInfo(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String templateCode,
            @RequestPart("jsonData") @Valid DocumentSaveRequestDto requestDto,
            @RequestPart(value = "signature", required = false) MultipartFile signatureFile,
            @RequestPart(value = "proofDocuments", required = false) List<MultipartFile> proofDocuments){

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        return CommonResponse.ok(ssafyContractService.saveDoc(templateCode, requestDto, userId,signatureFile,proofDocuments));
    }
}

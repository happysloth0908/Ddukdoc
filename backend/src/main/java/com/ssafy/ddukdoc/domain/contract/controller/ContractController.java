package com.ssafy.ddukdoc.domain.contract.controller;

import com.ssafy.ddukdoc.domain.contract.dto.request.ContractReturnRequestDto;
import com.ssafy.ddukdoc.domain.contract.dto.request.RecipientInfoRequestDto;
import com.ssafy.ddukdoc.domain.contract.service.ContractService;
import com.ssafy.ddukdoc.domain.document.dto.request.DocumentSaveRequestDto;
import com.ssafy.ddukdoc.domain.template.dto.response.TemplateFieldResponseDto;
import com.ssafy.ddukdoc.global.common.response.ApiResponse;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.security.auth.UserPrincipal;
import com.ssafy.ddukdoc.global.util.AuthenticationUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/contract")
@RequiredArgsConstructor
public class ContractController {
    private final ContractService contractService;
    private final AuthenticationUtil authenticationUtil;

    @GetMapping("/{templateCode}")
    public ResponseEntity<ApiResponse<List<TemplateFieldResponseDto>>> getFieldList(@PathVariable String templateCode){
        return ApiResponse.ok(contractService.getTemplateFields(templateCode));
    }

    @PostMapping(value = "/{templateCode}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Integer>> saveInfo(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String templateCode,
            @RequestPart("jsonData") @Valid DocumentSaveRequestDto requestDto,
            @RequestPart(value = "signature", required = false) MultipartFile signatureFile){

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        // 서명 파일 null 또는 비어있는지 확인
        if (signatureFile == null || signatureFile.isEmpty()) {
            return ApiResponse.error(
                    ErrorCode.SIGNATURE_FILE_NOT_FOUND);
        }
        return ApiResponse.ok(contractService.saveDocument(templateCode, requestDto, userId,signatureFile));
    }

    //s3 파일 복호화 후 다운 예시 코드
    @GetMapping("/signature/{documentId}/{userId}")
    public ResponseEntity<byte[]> downloadSignature(
            @PathVariable Integer documentId,
            @PathVariable Integer userId) {

        byte[] signatureData = contractService.downloadSignature(documentId, userId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG); // 이 부분은 나중에 어떤 데이터 형식을 받는가에 따라
        headers.setContentLength(signatureData.length);
        //데이터를 바이너리 형식으로 전달
        return new ResponseEntity<>(signatureData, headers, HttpStatus.OK);
    }

    @PostMapping(value = "/{documentId}/signature", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> saveRecipientSignature(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Integer documentId,
            @RequestPart("jsonData") @Valid
            RecipientInfoRequestDto requestDto,
            @RequestPart(value = "signature", required = false) MultipartFile signatureFile) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        // 서명 파일 null 또는 비어있는지 확인
        if (signatureFile == null || signatureFile.isEmpty()) {
            return ApiResponse.error(ErrorCode.SIGNATURE_FILE_NOT_FOUND);
        }

        contractService.saveRecipientInfo(documentId, requestDto, userId, signatureFile);
        return ApiResponse.ok();
    }

    // 사용자의 문서 반송
    @PatchMapping("/return/{doc_id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> returnDocument(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("doc_id") Integer documentId,
            @RequestBody ContractReturnRequestDto contractReturnRequestDto){

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        contractService.returnDocument(userId, documentId, contractReturnRequestDto.getReturnReason());
        return ApiResponse.ok();
    }
}

package com.ssafy.ddukdoc.domain.contract.controller;

import com.ssafy.ddukdoc.domain.contract.service.ContractService;
import com.ssafy.ddukdoc.domain.document.dto.request.DocumentSaveRequestDto;
import com.ssafy.ddukdoc.domain.template.dto.response.TemplateFieldResponseDto;
import com.ssafy.ddukdoc.global.common.response.ApiResponse;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.security.auth.UserPrincipal;
import com.ssafy.ddukdoc.global.util.AuthenticationUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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
}

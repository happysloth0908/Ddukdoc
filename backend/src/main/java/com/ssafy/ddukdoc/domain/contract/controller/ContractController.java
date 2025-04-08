package com.ssafy.ddukdoc.domain.contract.controller;

import com.ssafy.ddukdoc.domain.contract.dto.request.ContractReturnRequestDto;
import com.ssafy.ddukdoc.domain.contract.dto.request.RecipientInfoRequestDto;
import com.ssafy.ddukdoc.domain.contract.service.ContractService;
import com.ssafy.ddukdoc.domain.document.dto.request.DocumentSaveRequestDto;
import com.ssafy.ddukdoc.domain.document.dto.response.DocumentSaveResponseDto;
import com.ssafy.ddukdoc.domain.template.dto.response.TemplateFieldResponseDto;
import com.ssafy.ddukdoc.global.aop.GeneralAccess;
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
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/contract")
@RequiredArgsConstructor
@Tag(name = "계약 관리", description = "계약/템플릿 관련 API")
public class ContractController {
    private final ContractService contractService;
    private final AuthenticationUtil authenticationUtil;

    @GetMapping("/{templateCode}")
    @Operation(summary = "템플릿 필드 목록 조회", description = "템플릿 코드에 해당하는 필드 목록을 조회합니다.")
    @ApiErrorCodeExamples({ErrorCode.TEMPLATE_NOT_FOUND})
    public ResponseEntity<CommonResponse<List<TemplateFieldResponseDto>>> getFieldList(@PathVariable String templateCode){
        return CommonResponse.ok(contractService.getTemplateFields(templateCode));
    }

    @PostMapping(value = "/{templateCode}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @GeneralAccess
    @Operation(summary = "문서 저장", description = "템플릿 코드에 해당하는 문서를 저장합니다. \n\n pin 번호를 return 합니다.")
    @ApiErrorCodeExamples({ErrorCode.SIGNATURE_FILE_NOT_FOUND, ErrorCode.INVALID_USER_ID, ErrorCode.TEMPLATE_NOT_FOUND, ErrorCode.TEMPLATE_FIELD_NOT_FOUND, ErrorCode.INVALID_USER_ID, ErrorCode.FORBIDDEN_ACCESS, ErrorCode.FILE_UPLOAD_ERROR, ErrorCode.INVALID_INPUT_VALUE})
    public ResponseEntity<CommonResponse<DocumentSaveResponseDto>> saveInfo(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String templateCode,
            @RequestPart("jsonData") @Valid DocumentSaveRequestDto requestDto,
            @RequestPart(value = "signature", required = false) MultipartFile signatureFile){

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        // 서명 파일 null 또는 비어있는지 확인
        if (signatureFile == null || signatureFile.isEmpty()) {
            return CommonResponse.error(
                    ErrorCode.SIGNATURE_FILE_NOT_FOUND);
        }
        return CommonResponse.ok(contractService.saveDocument(templateCode, requestDto, userId,signatureFile));
    }

    //s3 파일 복호화 후 다운 예시 코드
    @GetMapping("/signature/{documentId}/{userId}")
    @Operation(summary = "서명 이미지 다운로드", description = "특정 문서의 사용자 서명 이미지를 다운로드합니다.")
    @ApiErrorCodeExamples({ErrorCode.DOCUMENT_NOT_FOUND, ErrorCode.SIGNATURE_FILE_NOT_FOUND, ErrorCode.FILE_DOWNLOAD_ERROR})
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
    @GeneralAccess
    @Operation(summary = "수신자 서명 저장", description = "문서의 수신자 서명 및 필드 정보를 저장합니다.")
    @ApiErrorCodeExamples({ErrorCode.SIGNATURE_FILE_NOT_FOUND, ErrorCode.INVALID_USER_ID, ErrorCode.DECRYPTION_ERROR, ErrorCode.FILE_DOWNLOAD_ERROR, ErrorCode.PDF_GENERATION_ERROR, ErrorCode.FILE_UPLOAD_ERROR})
    public ResponseEntity<CommonResponse<Void>> saveRecipientSignature(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Integer documentId,
            @RequestPart("jsonData") @Valid
            RecipientInfoRequestDto requestDto,
            @RequestPart(value = "signature", required = false) MultipartFile signatureFile) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        // 서명 파일 null 또는 비어있는지 확인
        if (signatureFile == null || signatureFile.isEmpty()) {
            return CommonResponse.error(ErrorCode.SIGNATURE_FILE_NOT_FOUND);
        }

        contractService.saveRecipientInfo(documentId, requestDto, userId, signatureFile);
        return CommonResponse.ok();
    }

    // 사용자의 문서 반송
    @PatchMapping("/return/{doc_id}")
    @GeneralAccess
    @Operation(summary = "문서 반송", description = "사용자가 문서를 반송 처리합니다.")
    @ApiErrorCodeExamples({ErrorCode.DOCUMENT_NOT_FOUND, ErrorCode.FORBIDDEN_ACCESS, ErrorCode.INVALID_DOCUMENT_STATUS})
    public ResponseEntity<CommonResponse<Void>> returnDocument(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("doc_id") Integer documentId,
            @Valid @RequestBody ContractReturnRequestDto contractReturnRequestDto){

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        contractService.returnDocument(userId, documentId, contractReturnRequestDto.getReturnReason());
        return CommonResponse.ok();
    }
}

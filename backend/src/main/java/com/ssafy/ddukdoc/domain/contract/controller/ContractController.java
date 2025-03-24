package com.ssafy.ddukdoc.domain.contract.controller;

import com.ssafy.ddukdoc.domain.contract.service.ContractService;
import com.ssafy.ddukdoc.domain.document.dto.request.DocumentSaveRequestDto;
import com.ssafy.ddukdoc.domain.document.service.DocumentService;
import com.ssafy.ddukdoc.domain.template.dto.response.TemplateFieldResponseDto;
import com.ssafy.ddukdoc.global.common.response.ApiResponse;
import com.ssafy.ddukdoc.global.security.auth.UserPrincipal;
import com.ssafy.ddukdoc.global.util.AuthenticationUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
            @RequestParam("signature") MultipartFile signatureFile){

       // Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        //문서 저장
        int pin = contractService.saveDocument(templateCode, requestDto, 1,signatureFile);

        return ApiResponse.ok(pin);
    }
}

package com.ssafy.ddukdoc.domain.contract.controller;

import com.ssafy.ddukdoc.domain.contract.service.SsafyContractService;
import com.ssafy.ddukdoc.domain.template.dto.response.TemplateFieldResponseDto;
import com.ssafy.ddukdoc.global.aop.swagger.ApiErrorCodeExamples;
import com.ssafy.ddukdoc.global.common.response.CommonResponse;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.util.AuthenticationUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/ssafy/contract")
@RequiredArgsConstructor
@Tag(name = "계약 관리", description = "계약/템플릿 관련 API")
public class SsafyContractController {
    private final SsafyContractService ssafyContractService;
    private final AuthenticationUtil authenticationUtil;

    @GetMapping("/{templateCode}")
    @Operation(summary = "템플릿 필드 목록 조회", description = "템플릿 코드에 해당하는 필드 목록을 조회합니다.")
    @ApiErrorCodeExamples({ErrorCode.TEMPLATE_NOT_FOUND})
    public ResponseEntity<CommonResponse<List<TemplateFieldResponseDto>>> getFieldList(@PathVariable String templateCode){
        return CommonResponse.ok(ssafyContractService.getTemplateFields(templateCode));
    }

}

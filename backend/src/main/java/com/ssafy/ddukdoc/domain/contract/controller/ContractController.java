package com.ssafy.ddukdoc.domain.contract.controller;

import com.ssafy.ddukdoc.domain.contract.service.ContractService;
import com.ssafy.ddukdoc.domain.template.dto.TemplateFieldResponseDto;
import com.ssafy.ddukdoc.global.common.response.ApiResponse;
import com.ssafy.ddukdoc.global.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/contract")
@RequiredArgsConstructor
public class ContractController {
    private final ContractService contractService;
    @GetMapping("/{templateCode}")
    public ResponseEntity<ApiResponse<List<TemplateFieldResponseDto>>> getFieldList(@PathVariable String templateCode){
        return contractService.getTemplateFields(templateCode);
    }
}

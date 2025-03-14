package com.ssafy.ddukdoc.domain.contract.controller;

import com.ssafy.ddukdoc.domain.contract.service.ContractService;
import com.ssafy.ddukdoc.global.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/contract")
@RequiredArgsConstructor
public class ContractController {
    private final ContractService contractService;
    //private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/{templateCode}")
    public ResponseEntity<?> getFieldList(@PathVariable String templateCode){
        return contractService.getTemplateFields(templateCode);
    }
}

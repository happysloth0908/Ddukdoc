package com.ssafy.ddukdoc.domain.contract.service;

import com.ssafy.ddukdoc.domain.template.dto.response.TemplateFieldResponseDto;
import com.ssafy.ddukdoc.domain.template.entity.Template;
import com.ssafy.ddukdoc.domain.template.entity.TemplateCode;
import com.ssafy.ddukdoc.domain.template.entity.TemplateField;
import com.ssafy.ddukdoc.domain.template.repository.TemplateFieldRepository;
import com.ssafy.ddukdoc.domain.template.repository.TemplateRepository;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class SsafyContractService {
    private final TemplateRepository templateRepository;
    private final TemplateFieldRepository templateFieldRepository;

    public List<TemplateFieldResponseDto> getTemplateFields(String  codeStr){

        TemplateCode templateCode = TemplateCode.fromString(codeStr);

        Template template = templateRepository.findByCode(templateCode.name())
                .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_NOT_FOUND, "templateCode", templateCode));
        List<TemplateField> fields = templateFieldRepository.findByTemplateIdOrderByDisplayOrderAsc(template.getId());

        List<TemplateFieldResponseDto> fieldResponses = fields.stream()
                .map(TemplateFieldResponseDto::of).collect(Collectors.toList());

        return fieldResponses;
    }


}

package com.ssafy.ddukdoc.domain.contract.service;

import com.ssafy.ddukdoc.domain.template.dto.TemplateFieldResponseDto;
import com.ssafy.ddukdoc.domain.template.entity.Template;
import com.ssafy.ddukdoc.domain.template.entity.TemplateField;
import com.ssafy.ddukdoc.domain.template.repository.TemplateFieldRepository;
import com.ssafy.ddukdoc.domain.template.repository.TemplateRepository;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContractService {
    private final TemplateRepository templateRepository;
    private final TemplateFieldRepository templateFieldRepository;

    public List<TemplateFieldResponseDto> getTemplateFields(String templateCode){
        Template template = templateRepository.findByCode(templateCode)
                .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_NOT_FOUND, "templateCode", templateCode));
        List<TemplateField> fields = templateFieldRepository.findByTemplateIdOrderByDisplayOrderAsc(template.getId());

        List<TemplateFieldResponseDto> fieldResponses = fields.stream()
                .map(TemplateFieldResponseDto::of).collect(Collectors.toList());

        return fieldResponses;
    }
}

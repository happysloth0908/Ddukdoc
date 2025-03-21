package com.ssafy.ddukdoc.domain.contract.service;

import com.ssafy.ddukdoc.domain.document.dto.request.DocumentSaveRequestDto;
import com.ssafy.ddukdoc.domain.document.entity.Document;
import com.ssafy.ddukdoc.domain.document.entity.DocumentFieldValue;
import com.ssafy.ddukdoc.domain.document.repository.DocumentFieldValueRepository;
import com.ssafy.ddukdoc.domain.document.repository.DocumentRepository;
import com.ssafy.ddukdoc.domain.template.dto.response.TemplateFieldResponseDto;
import com.ssafy.ddukdoc.domain.template.entity.Template;
import com.ssafy.ddukdoc.domain.template.entity.TemplateField;
import com.ssafy.ddukdoc.domain.template.repository.TemplateFieldRepository;
import com.ssafy.ddukdoc.domain.template.repository.TemplateRepository;
import com.ssafy.ddukdoc.domain.user.entity.User;
import com.ssafy.ddukdoc.domain.user.repository.UserRepository;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContractService {
    private final TemplateRepository templateRepository;
    private final UserRepository userRepository;
    private final TemplateFieldRepository templateFieldRepository;
    private final DocumentRepository documentRepository;
    private final DocumentFieldValueRepository documentFieldValueRepository;

    public List<TemplateFieldResponseDto> getTemplateFields(String templateCode){
        Template template = templateRepository.findByCode(templateCode)
                .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_NOT_FOUND, "templateCode", templateCode));
        List<TemplateField> fields = templateFieldRepository.findByTemplateIdOrderByDisplayOrderAsc(template.getId());

        List<TemplateFieldResponseDto> fieldResponses = fields.stream()
                .map(TemplateFieldResponseDto::of).collect(Collectors.toList());

        return fieldResponses;
    }
    @Transactional
    public int saveDocument(String templateCode, DocumentSaveRequestDto requestDto, Integer userId){

        //사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_USER_ID, "userId", userId));

        // 템플릿 조회
        Template template = templateRepository.findByCode(templateCode)
                .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_NOT_FOUND, "templateCode", templateCode));

        // 랜덤 핀코드 생성
        int pin = generatePinCode();

        //Document 엔티티 생성 및 저장
        String status = determineDocumentStatus(templateCode);
        Document document = requestDto.toEntity(user,template,pin,status);
        Document saveDocument = documentRepository.save(document);

        // DocumentFieldValue 엔티티들 생성 및 저장
        saveDocumentFieldValues(requestDto, saveDocument, user);

        return pin;
    }

    private void saveDocumentFieldValues(DocumentSaveRequestDto requestDto, Document document, User user){
        requestDto.getData().forEach(fieldValueDto ->{
            TemplateField  field = templateFieldRepository.findById(fieldValueDto.getFieldId())
                    .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_FIELD_NOT_FOUND,"template_field_id",fieldValueDto.getFieldId()));

            DocumentFieldValue fieldValue = fieldValueDto.toEntity(document, field, user);
            documentFieldValueRepository.save(fieldValue);
        });
    }

    private String determineDocumentStatus(String templateCode){
        if ("G1".equals(templateCode) || "G2".equals(templateCode)) {
            return "서명 대기";
        } else {
            return "완료";
        }
    }
    private int generatePinCode(){
        return (int)(Math.random() * 900000) + 100000; // 100000 ~ 999999
    }
}

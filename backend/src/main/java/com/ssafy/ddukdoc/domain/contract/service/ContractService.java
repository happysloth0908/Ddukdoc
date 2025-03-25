package com.ssafy.ddukdoc.domain.contract.service;

import com.ssafy.ddukdoc.domain.contract.entity.Signature;
import com.ssafy.ddukdoc.domain.contract.repository.SignatureRepository;
import com.ssafy.ddukdoc.domain.document.dto.request.DocumentSaveRequestDto;
import com.ssafy.ddukdoc.domain.document.entity.Document;
import com.ssafy.ddukdoc.domain.document.entity.DocumentFieldValue;
import com.ssafy.ddukdoc.domain.document.entity.DocumentStatus;
import com.ssafy.ddukdoc.domain.document.repository.DocumentFieldValueRepository;
import com.ssafy.ddukdoc.domain.document.repository.DocumentRepository;
import com.ssafy.ddukdoc.domain.template.dto.response.TemplateFieldResponseDto;
import com.ssafy.ddukdoc.domain.template.entity.Role;
import com.ssafy.ddukdoc.domain.template.entity.Template;
import com.ssafy.ddukdoc.domain.template.entity.TemplateCode;
import com.ssafy.ddukdoc.domain.template.entity.TemplateField;
import com.ssafy.ddukdoc.domain.template.repository.RoleRepository;
import com.ssafy.ddukdoc.domain.template.repository.TemplateFieldRepository;
import com.ssafy.ddukdoc.domain.template.repository.TemplateRepository;
import com.ssafy.ddukdoc.domain.user.entity.User;
import com.ssafy.ddukdoc.domain.user.entity.UserDocRole;
import com.ssafy.ddukdoc.domain.user.repository.UserDocRoleRepository;
import com.ssafy.ddukdoc.domain.user.repository.UserRepository;
import com.ssafy.ddukdoc.global.common.util.S3Util;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
    private final S3Util s3Util;
    private final SignatureRepository signatureRepository;
    private final RoleRepository roleRepository;
    private final UserDocRoleRepository userDocRoleRepository;

    public List<TemplateFieldResponseDto> getTemplateFields(String  codeStr){

        TemplateCode templateCode = TemplateCode.fromString(codeStr);

        Template template = templateRepository.findByCode(templateCode.name())
                .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_NOT_FOUND, "templateCode", templateCode));
        List<TemplateField> fields = templateFieldRepository.findByTemplateIdOrderByDisplayOrderAsc(template.getId());

        List<TemplateFieldResponseDto> fieldResponses = fields.stream()
                .map(TemplateFieldResponseDto::of).collect(Collectors.toList());

        return fieldResponses;
    }
    @Transactional
    public int saveDocument(String codeStr, DocumentSaveRequestDto requestDto, Integer userId, MultipartFile signatureFile){

        TemplateCode templateCode = TemplateCode.fromString(codeStr);
        //사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_USER_ID, "userId", userId));

        // 템플릿 조회
        Template template = templateRepository.findByCode(templateCode.name())
                .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_NOT_FOUND, "templateCode", templateCode.name()));

        // 랜덤 핀코드 생성
        int pin = generatePinCode();

        //Document 엔티티 생성 및 저장
        Document document = requestDto.toEntity(user,template,pin,templateCode);
        Document saveDocument = documentRepository.save(document);

        // DocumentFieldValue 엔티티들 생성 및 저장
        saveDocumentFieldValues(requestDto, saveDocument, user);

        saveSignature(document,userId,signatureFile);

        //userID 저장
        saveUserDocRole(saveDocument,user,requestDto.getRoleId());

        return pin;
    }

    private void saveUserDocRole(Document document, User user, int roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(()-> new CustomException(ErrorCode.INVALID_INPUT_VALUE,"role_id",+roleId));

        UserDocRole userDocRole = UserDocRole.builder()
                .user(user)
                .document(document)
                .role(role)
                .build();

        userDocRoleRepository.save(userDocRole);
    }

    private void saveSignature(Document document, Integer userId, MultipartFile signatureFile) {
        // 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_USER_ID, "userId", userId));

        // 사용자 권한 확인
        if (!document.getCreator().getId().equals(userId) &&
                (document.getRecipient() == null || !document.getRecipient().getId().equals(userId))) {
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS, "userId", userId);
        }

        String dirName = "signature/"+document.getId()+"/"+userId;
        String s3Path = s3Util.uploadFile(signatureFile,dirName);

        Signature signature = Signature.builder()
                .user(user)
                .document(document)
                .filePath(s3Path)
                .build();

        signatureRepository.save(signature);

        if(document.getRecipient() != null && document.getRecipient().getId().equals(userId)){
            document.updateStatus(DocumentStatus.SIGNED);
            documentRepository.save(document);
        }
    }

    private void saveDocumentFieldValues(DocumentSaveRequestDto requestDto, Document document, User user){
        List<DocumentFieldValue> fieldValues = requestDto.getData().stream()
                .map(fieldValueDto -> {
                    TemplateField field = templateFieldRepository.findById(fieldValueDto.getFieldId())
                            .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_FIELD_NOT_FOUND, "template_field_id", fieldValueDto.getFieldId()));

                    return fieldValueDto.toEntity(document, field, user);
                })
                .collect(Collectors.toList());

        documentFieldValueRepository.saveAll(fieldValues);
    }

    private int generatePinCode(){
        return (int)(Math.random() * 900000) + 100000; // 100000 ~ 999999
    }
}

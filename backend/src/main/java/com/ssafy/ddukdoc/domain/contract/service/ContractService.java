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

import java.io.File;
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

        //서명 파일 저장
        saveSignature(document,userId,signatureFile);

        //userID 저장
        saveUserDocRole(saveDocument,user,requestDto.getRoleId());

        return pin;
    }

    private void saveUserDocRole(Document document, User user, int roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(()-> new CustomException(ErrorCode.INVALID_INPUT_VALUE,"role_id",roleId));

        UserDocRole userDocRole = UserDocRole.builder()
                .user(user)
                .document(document)
                .role(role)
                .build();

        userDocRoleRepository.save(userDocRole);
    }
    //서명 파일을 암호화하여 S3에 저장
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
        String s3Path = s3Util.uploadEncryptedFile(signatureFile,dirName);

        Signature signature = Signature.builder()
                .user(user)
                .document(document)
                .filePath(s3Path)
                .build();

        signatureRepository.save(signature);
        //수신자가 서명을 한 상태인 경우 문서 상태 SIGNED로 변경
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

    // 서명 파일 다운로드 및 복호화
    public byte[] downloadSignature(Integer documentId, Integer userId) {
        // 문서 정보 조회
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, "documentId", documentId));

        // 서명 정보 조회
        Signature signature = signatureRepository.findByDocumentIdAndUserId(documentId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.SIGNATURE_FILE_NOT_FOUND, "documentId", documentId));

        // S3에서 파일 다운로드 및 복호화
        String s3Path = signature.getFilePath();
        String fileKey;

        try {
            // S3 URL에서 파일 키 추출
            if (s3Path.contains("/eftoj1/")) {
                fileKey = "eftoj1/" + s3Path.split("/eftoj1/")[1];
            } else {
                throw new CustomException(ErrorCode.FILE_DOWNLOAD_ERROR, "signature", "잘못된 파일 경로 형식입니다.");
            }

            // 파일 다운로드 및 복호화
            File decryptedFile = s3Util.downloadAndDecryptFile(fileKey);

            // 파일이 존재하는지 다시 확인
            if (!decryptedFile.exists()) {
                throw new CustomException(ErrorCode.FILE_DOWNLOAD_ERROR, "signature",
                        "복호화된 파일이 존재하지 않습니다: " + decryptedFile.getAbsolutePath());
            }

            // 파일 내용을 바이트 배열로 변환
            byte[] fileContent = java.nio.file.Files.readAllBytes(decryptedFile.toPath());

            // 중요: 읽은 후에 임시 파일 삭제
            boolean deleted = decryptedFile.delete();

            return fileContent;
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException(ErrorCode.FILE_DOWNLOAD_ERROR, "signature",
                    "서명 파일 다운로드 중 오류: " + e.getMessage());
        }
    }
}

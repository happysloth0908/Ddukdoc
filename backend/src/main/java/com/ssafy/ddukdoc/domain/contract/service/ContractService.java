package com.ssafy.ddukdoc.domain.contract.service;

import com.ssafy.ddukdoc.domain.contract.dto.request.RecipientInfoRequestDto;
import com.ssafy.ddukdoc.domain.contract.entity.Signature;
import com.ssafy.ddukdoc.domain.contract.repository.SignatureRepository;
import com.ssafy.ddukdoc.domain.document.dto.request.DocumentFieldDto;
import com.ssafy.ddukdoc.domain.document.dto.request.DocumentSaveRequestDto;
import com.ssafy.ddukdoc.domain.document.dto.response.DocumentSaveResponseDto;
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
import com.ssafy.ddukdoc.global.common.util.AESUtil;
import com.ssafy.ddukdoc.global.common.util.MultipartFileUtils;
import com.ssafy.ddukdoc.global.common.util.S3Util;
import com.ssafy.ddukdoc.global.common.util.pdfgenerator.PdfGeneratorUtil;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
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
    private final AESUtil aesUtil;
    private final PdfGeneratorUtil pdfGeneratorUtil;

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
    public DocumentSaveResponseDto saveDocument(String codeStr, DocumentSaveRequestDto requestDto, Integer userId, MultipartFile signatureFile){

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
        saveSenderInfo(requestDto, saveDocument, user);

        //서명 파일 저장
        saveSignature(document,userId,signatureFile);

        //userID 저장
        saveUserDocRole(saveDocument,user,requestDto.getRoleId());

        DocumentSaveResponseDto responseDto = DocumentSaveResponseDto.of(pin,saveDocument.getId());

        return responseDto;
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
    private void saveSenderInfo(DocumentSaveRequestDto requestDto, Document document, User user) {
        List<DocumentFieldValue> fieldValues = requestDto.getData().stream()
                .map(fieldValueDto -> {
                    TemplateField field = templateFieldRepository.findById(fieldValueDto.getFieldId())
                            .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_FIELD_NOT_FOUND,
                                    "template_field_id", fieldValueDto.getFieldId()));

                    // 필드 값을 암호화하여 저장
                    String encryptedValue = aesUtil.encrypt(fieldValueDto.getFieldValue());

                    return fieldValueDto.toEntity(document, field, user,encryptedValue);

                })
                .collect(Collectors.toList());

        documentFieldValueRepository.saveAll(fieldValues);
        // 암호화된 값 대신 원본 값으로 DTO 생성
        //return requestDto.getData();
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
        try {
            // 문서 정보 조회
            Document document = documentRepository.findById(documentId)
                    .orElseThrow(() -> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, "documentId", documentId));

            // 서명 정보 조회
            Signature signature = signatureRepository.findByDocumentIdAndUserId(documentId, userId)
                    .orElseThrow(() -> new CustomException(ErrorCode.SIGNATURE_FILE_NOT_FOUND, "documentId", documentId));

            // S3에서 파일 다운로드 및 복호화
            String s3Path = signature.getFilePath();
            return s3Util.downloadAndDecryptFileToBytes(s3Path);

        } catch (CustomException e) {
            throw new CustomException(e.getErrorCode());
        } catch (Exception e) {
            // 그 외 예외는 CustomException으로 변환
            throw new CustomException(ErrorCode.FILE_DOWNLOAD_ERROR, "signature",
                    "서명 파일 처리 중 오류: " + e.getMessage());
        }
    }

    @Transactional
    public void saveRecipientInfo(Integer documentId, RecipientInfoRequestDto requestDto,
                                       Integer userId, MultipartFile signatureFile) {
        // 1. 문서 유효성 검증
        Document document = validateDocument(documentId, userId, requestDto.getRoleId());

        // 2. 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_USER_ID, "userId", userId));

        // 3. DocumentFieldValue 엔티티 생성 및 저장 (데이터 암호화 후 저장)
        saveRecipientFieldValues(requestDto, document, user);
        List<DocumentFieldValue> documentFieldValues  = documentFieldValueRepository.findAllByDocumentIdOrderByFieldDisplayOrder(documentId);
        List<DocumentFieldDto> savedFieldValues = documentFieldValues.stream()
                .map(value -> {
                    // 암호화된 필드 값 복호화 (필요한 경우)
                    String decryptedValue = value.getFieldValue();
                    try {
                        decryptedValue = aesUtil.decrypt(value.getFieldValue());
                    } catch (Exception e) {
                        log.warn("필드 값 복호화 실패: {}", e.getMessage());
                    }
                    // DocumentFieldDto 객체로 변환
                    return DocumentFieldDto.of(value, decryptedValue);
                })
                .collect(Collectors.toList());

        // 4. 서명 파일 저장
        saveSignature(document, userId, signatureFile);

        // 서명 맵 생성
        Map<Integer, byte[]> signatures = signatureRepository.findAllByDocumentId(documentId).stream()
            .collect(Collectors.toMap(
                signature -> {
                    Optional<UserDocRole> userDocRole = userDocRoleRepository
                            .findByDocumentIdAndUserId(documentId, signature.getUser().getId());

                    if (userDocRole.isPresent()) {
                        log.info("Mapping signature - User ID: {}, Role ID: {}",
                                signature.getUser().getId(),
                                userDocRole.get().getRole().getId());
                        return userDocRole.get().getRole().getId();
                    } else {
                        log.warn("Cannot map signature for user {}", signature.getUser().getId());
                        return null;
                    }
                },
                signature -> s3Util.downloadAndDecryptFileToBytes(signature.getFilePath()),
                (v1, v2) -> v1 // 중복 키 처리 로직
            ));


        // 6. 문서 PDF 생성 및 해시 저장
        byte[] pdfWithHash = pdfGeneratorUtil.generatePdfForHash(
                TemplateCode.fromString(document.getTemplate().getCode()),
                savedFieldValues,
                signatures
        );

        // 7. 암호화된 PDF 저장
        String pdfPath = saveEncryptedPdf(pdfWithHash, document);

        // 8. 문서 상태 변경
        updateDocumentStatus(document, pdfPath);

    }
    // 문서 유효성 검증 메서드
    private Document validateDocument(Integer documentId, Integer userId, Integer roleId) {
        // 문서 조회
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, "documentId", documentId));

        // 문서의 수신자가 맞는지 확인
        if (document.getRecipient() == null || !document.getRecipient().getId().equals(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS, "userId", userId);
        }

        // 문서 상태가 WAITING인지 확인
        if (document.getStatus() != DocumentStatus.WAITING) {
            throw new CustomException(ErrorCode.INVALID_DOCUMENT_STATUS, "status", document.getStatus());
        }

        // 역할 검증
        roleRepository.findById(roleId)
                .orElseThrow(() -> new CustomException(ErrorCode.ROLE_NOT_FOUND, "role_id", roleId));

        return document;
    }
    private List<DocumentFieldDto> saveRecipientFieldValues(RecipientInfoRequestDto requestDto, Document document, User user) {
        List<DocumentFieldValue> fieldValues = requestDto.getData().stream()
                .map(fieldValueDto -> {
                    TemplateField field = templateFieldRepository.findById(fieldValueDto.getFieldId())
                            .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_FIELD_NOT_FOUND,
                                    "template_field_id", fieldValueDto.getFieldId()));

                    // 필드 값을 암호화하여 저장
                    String encryptedValue = aesUtil.encrypt(fieldValueDto.getFieldValue());

                    return fieldValueDto.toEntity(document, field, user,encryptedValue);

                })
                .collect(Collectors.toList());

        documentFieldValueRepository.saveAll(fieldValues);
        // 암호화된 값 대신 원본 값으로 DTO 생성
        return requestDto.getData();
    }

    //암호화된 pdf s3에 저장
    private String saveEncryptedPdf(byte[] pdfData, Document document) {

        MultipartFile multipartFile = MultipartFileUtils.createMultipartFile(
                "document.pdf",
                "document.pdf",
                "application/pdf",
                pdfData
        );

        // PDF 파일을 암호화하여 S3에 업로드
        String pdfPath = s3Util.uploadEncryptedFile(multipartFile, "contract/" + document.getId());

        return pdfPath;
    }

    // 문서 상태 변경 메서드
    private void updateDocumentStatus(Document document, String pdfPath) {
        document.updateStatus(DocumentStatus.SIGNED);
        document.updateFilePath(pdfPath);
        documentRepository.save(document);
    }


    @Transactional
    public void returnDocument(Integer userId, Integer documentId, String returnReason){

        // Document 검증
        Document document = documentRepository.findById(documentId)
                .orElseThrow(()-> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, "documentId", documentId));
        
        // 사용자 검증 (수신자인지 검증)
        if(document.getRecipient()==null || !document.getRecipient().getId().equals(userId)){
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS, "userId", userId)
                    .addParameter("documentId", documentId);
        }

        // 문서 상태 검증
        if(!document.getStatus().equals(DocumentStatus.WAITING)){
            throw new CustomException(ErrorCode.INVALID_DOCUMENT_STATUS, "status", document.getStatus())
                    .addParameter("documentId", documentId);
        }
        
        // 반송 이유 업데이트
        document.updateReturnReason(returnReason);
        
        // 문서 상태 업데이트
        document.updateStatus(DocumentStatus.RETURNED);
    }

}

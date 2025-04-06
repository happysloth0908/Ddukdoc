package com.ssafy.ddukdoc.domain.document.service;

import com.ssafy.ddukdoc.domain.contract.entity.Signature;
import com.ssafy.ddukdoc.domain.contract.repository.SignatureRepository;
import com.ssafy.ddukdoc.domain.document.dto.request.DocumentSearchRequestDto;
import com.ssafy.ddukdoc.domain.document.dto.response.*;
import com.ssafy.ddukdoc.domain.document.entity.Document;
import com.ssafy.ddukdoc.domain.document.entity.DocumentFieldValue;
import com.ssafy.ddukdoc.domain.document.entity.DocumentStatus;
import com.ssafy.ddukdoc.domain.document.repository.DocumentFieldValueRepository;
import com.ssafy.ddukdoc.domain.document.repository.DocumentRepository;
import com.ssafy.ddukdoc.domain.template.entity.Role;
import com.ssafy.ddukdoc.domain.template.repository.RoleRepository;
import com.ssafy.ddukdoc.domain.user.entity.User;
import com.ssafy.ddukdoc.domain.user.entity.UserDocRole;
import com.ssafy.ddukdoc.domain.user.entity.UserDocRoleStatus;
import com.ssafy.ddukdoc.domain.user.repository.UserDocRoleRepository;
import com.ssafy.ddukdoc.domain.user.repository.UserRepository;
import com.ssafy.ddukdoc.global.common.CustomPage;
import com.ssafy.ddukdoc.global.common.util.S3Util;
import com.ssafy.ddukdoc.global.common.util.encrypt.AESUtil;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final SignatureRepository signatureRepository;
    private final DocumentFieldValueRepository documentFieldValueRepository;
    private final UserRepository userRepository;
    private final UserDocRoleRepository userDocRoleRepository;
    private final RoleRepository roleRepository;
    private final S3Util s3Util;
    private final AESUtil aesUtil;
    
    public static final String DOCUMENT_ID = "documentId";
    public static final String USER_ID = "userId";

    public CustomPage<DocumentListResponseDto> getDocumentList(Integer userId, DocumentSearchRequestDto documentSearchRequestDto, Pageable pageable) {
        Page<Document> documentList = documentRepository.findDocumentListByUserId(
                documentSearchRequestDto.getSendReceiveStatus(),
                documentSearchRequestDto.getTemplateCode(),
                documentSearchRequestDto.getKeyword(),
                documentSearchRequestDto.getStatus(),
                documentSearchRequestDto.getCreatedAt(),
                userId,
                pageable
        );

        return new CustomPage<>(documentList.map(DocumentListResponseDto::of));
    }

    public DocumentDetailResponseDto getDocumentDetail(Integer userId, Integer documentId) {

        // Document 조회, 엔티티를 id로 조회 했을때 없으면 예외 발생
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, DOCUMENT_ID, documentId));

        // 문서 접근 권한 검증 (발신자 또는 수신자만 조회 가능)
        validateDocumentAccess(document, userId);

        // 문서 삭제 되었는지 검증
        if (document.getStatus().equals(DocumentStatus.DELETED)) {
            throw new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, DOCUMENT_ID, documentId)
                    .addParameter(USER_ID, userId);
        }

        // 문서 필드값 조회
        List<DocumentFieldResponseDto> fieldValues = getDecryptData(documentFieldValueRepository.findAllByDocumentIdOrderByFieldDisplayOrder(documentId));

        // 사용자 역할 정보와 서명 정보 추출
        UserRoleResponseDto userRoleInfo = extractUserRoleInfo(document);
        SignatureResponseDto signatureInfo = extractSignatureInfo(document);

        boolean isRecipient = userId.equals(document.getRecipient().getId());

        return DocumentDetailResponseDto.of(document, fieldValues, signatureInfo, userRoleInfo, isRecipient);
    }

    //문서 데이터 복호화
    public List<DocumentFieldResponseDto> getDecryptData(List<DocumentFieldValue> fieldValues) {
        List<DocumentFieldResponseDto> decryptedData = fieldValues.stream()
                .map(value -> {
                    // 암호화된 필드 값 복호화
                    String decryptedValue = aesUtil.decrypt(value.getFieldValue());
                    // DocumentFieldResponseDto 객체로 변환
                    return DocumentFieldResponseDto.of(value, decryptedValue);
                })
                .collect(Collectors.toList());

        return decryptedData;
    }


    @Transactional
    public void deleteDocument(Integer userId, Integer documentId) {

        // Document 조회, 엔티티를 id로 조회 했을때 없으면 예외 발생
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, DOCUMENT_ID, documentId));

        // 발신자 확인 예외처리
        if (!document.getCreator().getId().equals(userId)) {
            throw new CustomException(ErrorCode.CREATOR_NOT_MATCH, USER_ID, userId)
                    .addParameter(DOCUMENT_ID, documentId);
        }

        // 반송 상태 확인 예외처리
        if (!document.getStatus().equals(DocumentStatus.RETURNED)) {
            throw new CustomException(ErrorCode.DOCUMENT_NOT_RETURNED, DOCUMENT_ID, documentId)
                    .addParameter("documentStatus", document.getStatus().name());
        }

        // 문서 상태를 삭제로 변경
        document.updateStatus(DocumentStatus.DELETED);
    }


    // 문서 접근 권한 검증 메서드
    private void validateDocumentAccess(Document document, Integer userId) {
        boolean isCreator = document.getCreator() != null && document.getCreator().getId().equals(userId);
        boolean isRecipient = document.getRecipient() != null && document.getRecipient().getId().equals(userId);

        // 발신자 혹은 수신자인 경우 접근 허용
        if (isCreator || isRecipient) {
            return;
        }

        // 발신자도 아니고 수신자도 아닌 경우
        if (document.getRecipient() == null) {
            // 수신자 정보가 없으면 핀코드 입력 요청하는 예외 발생
            throw new CustomException(ErrorCode.PIN_CODE_REQUIRED, DOCUMENT_ID, document.getId())
                    .addParameter(USER_ID, userId)
                    .addParameter("creatorName", document.getCreator().getName())
                    .addParameter("documentTitle", document.getTitle());
        }

        // 수신자 정보가 있음에도 사용자가 수신자가 아니라면 접근 금지 예외 발생 (수신자도, 발신자도 아닌 경우)
        throw new CustomException(ErrorCode.FORBIDDEN_ACCESS, USER_ID, userId)
                .addParameter(DOCUMENT_ID, document.getId());

    }

    // 핀코드 검증 로직
    @Transactional
    public void verifyPinCode(Integer userId, Integer documentId, Integer pinCode) {
        // Document 조회, 엔티티를 id로 조회 했을때 없으면 예외 발생
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, DOCUMENT_ID, documentId));

        // 핀코드 검증
        Integer documentPinCode = document.getPin();
        if (!documentPinCode.equals(pinCode)) {
            throw new CustomException(ErrorCode.PIN_CODE_MISMATCH);
        }

        // 수신자 정보 업데이트
        User recipient = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_USER_ID, USER_ID, userId));

        document.updateRecipient(recipient);

        // 수신자 문서 역할 업데이트
        updateUserDocRole(document);
    }

    private void updateUserDocRole(Document document) {
        // 생성자의 문서 역할 조회
        UserDocRole creatorDocRole = userDocRoleRepository.findAllByDocumentIdAndUserId(document.getId(), document.getCreator().getId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_DOC_ROLE_NOT_FOUND));

        // 수신자의 역할을 결정
        Integer newRecipientRoleId = UserDocRoleStatus.getRecipientRole(creatorDocRole.getRole().getId())
                .orElseThrow(() -> new CustomException(ErrorCode.ROLE_NOT_FOUND, "creatorRoleId", creatorDocRole.getRole().getId()));

        Role mappedRole = roleRepository.findById(newRecipientRoleId)
                .orElseThrow(() -> new CustomException(ErrorCode.ROLE_NOT_FOUND, "roleId", newRecipientRoleId));

        // 수신자 역할 생성
        UserDocRole newRole = UserDocRole.builder()
                .document(document)
                .user(document.getRecipient())
                .role(mappedRole)
                .build();
        userDocRoleRepository.save(newRole);
    }


    // 사용자 역할 정보 추출 (UserDocRoleRepository 호출)
    private UserRoleResponseDto extractUserRoleInfo(Document document) {
        List<UserDocRole> userDocRoles = userDocRoleRepository.findAllByDocumentId(document.getId());

        Integer creatorRoleId = userDocRoles.stream()
                .filter(udr -> document.getCreator() != null && udr.getUser().getId().equals(document.getCreator().getId()))
                .map(udr -> udr.getRole().getId())
                .findFirst()
                .orElse(null);

        Integer recipientRoleId = userDocRoles.stream()
                .filter(udr -> document.getRecipient() != null && udr.getUser().getId().equals(document.getRecipient().getId()))
                .map(udr -> udr.getRole().getId())
                .findFirst()
                .orElse(null);

        return UserRoleResponseDto.of(creatorRoleId, recipientRoleId);
    }

    // 서명 정보 추출 (SignatureRepository 호출)
    private SignatureResponseDto extractSignatureInfo(Document document) {
        List<Signature> signatures = signatureRepository.findAllByDocumentId(document.getId());

        String creatorSignaturePath = signatures.stream()
                .filter(s -> document.getCreator() != null && s.getUser().getId().equals(document.getCreator().getId()))
                .map(Signature::getFilePath)
                .findFirst()
                .orElse(null);

        String recipientSignaturePath = signatures.stream()
                .filter(s -> document.getRecipient() != null && s.getUser().getId().equals(document.getRecipient().getId()))
                .map(Signature::getFilePath)
                .findFirst()
                .orElse(null);

        // 복호화
        String creatorSignature = decryptSignature(creatorSignaturePath);
        String recipientSignature = decryptSignature(recipientSignaturePath);

        return SignatureResponseDto.of(creatorSignature, recipientSignature);
    }

    private String decryptSignature(String filePath) {
        if (filePath == null) {
            return null;
        }
        // 복호화
        byte[] fileContent = s3Util.downloadAndDecryptFileToBytes(filePath);
        // Base64 인코딩으로 return
        return Base64.getEncoder().encodeToString(fileContent);
    }


    // 문서 다운로드
    public DocumentDownloadResponseDto downloadDocument(Integer userId, Integer documentId) {

        // 문서 정보 조회
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, DOCUMENT_ID, documentId));

        // 사용자 조회 (발신자, 수신자만 다운 가능)
        if (!(document.getCreator().getId().equals(userId) || document.getRecipient().getId().equals(userId))) {
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS, USER_ID, userId)
                    .addParameter(DOCUMENT_ID, documentId);
        }

        // 문서 상태 조회 (서명완료일때만 다운로드 가능)
        if (!document.getStatus().equals(DocumentStatus.SIGNED)) {
            throw new CustomException(ErrorCode.DOCUMENT_NOT_SIGNED, "documentStatus", document.getStatus())
                    .addParameter(DOCUMENT_ID, documentId);
        }

        // S3에서 파일 다운로드
        byte[] content = s3Util.downloadAndDecryptFileToBytes(document.getFilePath());
        return DocumentDownloadResponseDto.of(document, content);
    }

}

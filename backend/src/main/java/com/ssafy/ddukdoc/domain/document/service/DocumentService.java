package com.ssafy.ddukdoc.domain.document.service;

import com.ssafy.ddukdoc.domain.contract.entity.Signature;
import com.ssafy.ddukdoc.domain.contract.repository.SignatureRepository;
import com.ssafy.ddukdoc.domain.document.dto.request.DocumentSearchRequestDto;
import com.ssafy.ddukdoc.domain.document.dto.response.DocumentDetailResponseDto;
import com.ssafy.ddukdoc.domain.document.dto.response.DocumentListResponseDto;
import com.ssafy.ddukdoc.domain.document.entity.Document;
import com.ssafy.ddukdoc.domain.document.entity.DocumentFieldValue;
import com.ssafy.ddukdoc.domain.document.repository.DocumentFieldValueRepository;
import com.ssafy.ddukdoc.domain.document.repository.DocumentRepository;
import com.ssafy.ddukdoc.global.common.CustomPage;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final SignatureRepository signatureRepository;
    private final DocumentFieldValueRepository documentFieldValueRepository;

    public CustomPage<DocumentListResponseDto> getDocumentList(Integer userId, DocumentSearchRequestDto documentSearchRequestDto, Pageable pageable){
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

    public DocumentDetailResponseDto getDocumentDetail(Integer userId, Integer documentId){

        // Document 조회, 엔티티를 id로 조회 했을때 없으면 예외 발생
        Document document = documentRepository.findById(documentId)
                .orElseThrow(()-> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, "documentId", documentId));

        // 문서 접근 권한 검증 (발신자 또는 수신자만 조회 가능)
        validateDocumentAccess(document, userId);
        
        // 문서 필드값 조회
        List<DocumentFieldValue> fieldValues = documentFieldValueRepository.findAllByDocumentIdOrderByFieldDisplayOrder(documentId);

        // 서명 정보 조회
        List<Signature> signatures = signatureRepository.findAllByDocumentId(documentId);

        // 서명 정보 처리
        String creatorSignature = null;
        String recipientSignature = null;

        for(Signature signature : signatures){
            Integer signatureUserId = signature.getUser().getId();

            if (document.getCreator() != null && document.getCreator().getId().equals(signatureUserId)) {
                creatorSignature = signature.getIpfsHash();
            }

            if(document.getRecipient()!= null && document.getRecipient().getId().equals(signatureUserId)){
                recipientSignature = signature.getIpfsHash();
            }
        }
        return DocumentDetailResponseDto.of(document, fieldValues, creatorSignature, recipientSignature);
    }

    // 문서 접근 권한 검증 메서드
    private void validateDocumentAccess(Document document, Integer userId) {
        boolean isCreator = document.getCreator() != null && document.getCreator().getId().equals(userId);
        boolean isRecipient = document.getRecipient() != null && document.getRecipient().getId().equals(userId);

        if (!isCreator && !isRecipient) {
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS, "userId", userId);
        }
    }

    // 핀코드 검증 로직
    public void verifyPinCode(Integer userId, Integer documentId, Integer pinCode){
        // Document 조회, 엔티티를 id로 조회 했을때 없으면 예외 발생
        Document document = documentRepository.findById(documentId)
                .orElseThrow(()-> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, "documentId", documentId));

        // 문서 접근 권한 검증 (발신자 또는 수신자만 조회 가능)
        validateDocumentAccess(document, userId);

        // 핀코드 검증
        Integer documentPinCode = document.getPin();
        if(!documentPinCode.equals(pinCode)){
            throw new CustomException(ErrorCode.PIN_CODE_MISMATCH, "pin_code", "잘못된 핀번호입니다.");
        }
    }

}

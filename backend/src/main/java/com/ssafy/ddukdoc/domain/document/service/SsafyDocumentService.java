package com.ssafy.ddukdoc.domain.document.service;

import com.ssafy.ddukdoc.domain.contract.entity.Signature;
import com.ssafy.ddukdoc.domain.contract.repository.SignatureRepository;
import com.ssafy.ddukdoc.domain.document.dto.request.SsafyDocumentSearchRequestDto;
import com.ssafy.ddukdoc.domain.document.dto.response.DocumentFieldResponseDto;
import com.ssafy.ddukdoc.domain.document.dto.response.SsafyDocumentDetailResponseDto;
import com.ssafy.ddukdoc.domain.document.dto.response.SsafyDocumentResponseDto;
import com.ssafy.ddukdoc.domain.document.entity.Document;
import com.ssafy.ddukdoc.domain.document.entity.DocumentFieldValue;
import com.ssafy.ddukdoc.domain.document.repository.DocumentFieldValueRepository;
import com.ssafy.ddukdoc.domain.document.repository.DocumentRepository;
import com.ssafy.ddukdoc.global.common.CustomPage;
import com.ssafy.ddukdoc.global.common.util.AESUtil;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SsafyDocumentService {

    private final DocumentRepository documentRepository;
    private final SignatureRepository signatureRepository;
    private final DocumentFieldValueRepository documentFieldValueRepository;
    private final AESUtil aesUtil;

    public CustomPage<SsafyDocumentResponseDto> getDocsList(Integer userId, SsafyDocumentSearchRequestDto ssafyDocumentSearchRequestDto, Pageable pageable) {
        Page<Document> documentList = documentRepository.findSsafyDocumentList(
                ssafyDocumentSearchRequestDto.getTemplateCode(),
                ssafyDocumentSearchRequestDto.getKeyword(),
                ssafyDocumentSearchRequestDto.getCreatedAt(),
                userId,
                pageable
        );
        return new CustomPage<>(documentList.map(SsafyDocumentResponseDto::of));
    }

    public SsafyDocumentDetailResponseDto getSsafyDocumentDetail(Integer userId, Integer documentId){

        // Document 검증
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, "documentId", documentId));

        // User 검증
        if(!document.getCreator().getId().equals(userId)){
            throw new CustomException(ErrorCode.CREATOR_NOT_MATCH, "userId", userId)
                    .addParameter("documentId", documentId);
        }
        
        // 서명 조회 >> 이거 base64로 다운받도록 하기
        Signature signature = signatureRepository.findByDocumentIdAndUserId(documentId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.SIGNATURE_FILE_NOT_FOUND, "documentId", documentId)
                                .addParameter("userId", userId));
        
        // 문서 필드 값 조회
        List<DocumentFieldResponseDto> fieldValues =  getDecryptData(documentFieldValueRepository.findAllByDocumentIdOrderByFieldDisplayOrder(documentId));

        return SsafyDocumentDetailResponseDto.of(document, fieldValues, signature.getFilePath());
    }

    // 문서 데이터 복호화
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
}

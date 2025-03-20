package com.ssafy.ddukdoc.domain.document.service;

import com.ssafy.ddukdoc.domain.document.dto.request.DocumentSearchRequestDto;
import com.ssafy.ddukdoc.domain.document.dto.response.DocumentDetailResponseDto;
import com.ssafy.ddukdoc.domain.document.dto.response.DocumentListResponseDto;
import com.ssafy.ddukdoc.domain.document.entity.Document;
import com.ssafy.ddukdoc.domain.document.repository.DocumentRepository;
import com.ssafy.ddukdoc.global.common.CustomPage;
import com.ssafy.ddukdoc.global.error.code.ErrorCode;
import com.ssafy.ddukdoc.global.error.exception.CustomException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;

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

        // Document 엔티티를 id로 조회 했을때 없으면 예외 발생
        Document document = documentRepository.findById(documentId)
                .orElseThrow(()-> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND, "documentId", documentId));
    }


}

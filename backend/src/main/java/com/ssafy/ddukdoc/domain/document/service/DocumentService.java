package com.ssafy.ddukdoc.domain.document.service;

import com.ssafy.ddukdoc.domain.document.dto.request.DocumentSearchRequestDto;
import com.ssafy.ddukdoc.domain.document.dto.response.DocumentListResponseDto;
import com.ssafy.ddukdoc.domain.document.entity.Document;
import com.ssafy.ddukdoc.domain.document.repository.DocumentRepository;
import com.ssafy.ddukdoc.global.common.CustomPage;
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

}

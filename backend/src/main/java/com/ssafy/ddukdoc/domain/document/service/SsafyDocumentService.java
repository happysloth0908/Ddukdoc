package com.ssafy.ddukdoc.domain.document.service;

import com.ssafy.ddukdoc.domain.document.dto.request.SsafyDocumentSearchRequestDto;
import com.ssafy.ddukdoc.domain.document.dto.response.SsafyDocumentResponseDto;
import com.ssafy.ddukdoc.domain.document.entity.Document;
import com.ssafy.ddukdoc.domain.document.repository.DocumentRepository;
import com.ssafy.ddukdoc.global.common.CustomPage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SsafyDocumentService {

    private final DocumentRepository documentRepository;

    public CustomPage<SsafyDocumentResponseDto> getDocsList(Integer userId, SsafyDocumentSearchRequestDto ssafyDocumentSearchRequestDto, Pageable pageable){
        Page<Document> documentList = documentRepository.findSsafyDocumentList(
                ssafyDocumentSearchRequestDto.getTemplateCode(),
                ssafyDocumentSearchRequestDto.getKeyword(),
                ssafyDocumentSearchRequestDto.getCreatedAt(),
                userId,
                pageable
        );
        return new CustomPage<>(documentList.map(SsafyDocumentResponseDto::of));
    }
}

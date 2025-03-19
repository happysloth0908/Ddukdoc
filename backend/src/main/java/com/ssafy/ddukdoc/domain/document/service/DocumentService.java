package com.ssafy.ddukdoc.domain.document.service;

import com.ssafy.ddukdoc.domain.document.dto.request.DocumentSearchRequestDto;
import com.ssafy.ddukdoc.domain.document.dto.response.DocumentListDto;
import com.ssafy.ddukdoc.domain.document.dto.response.DocumentListResponseDto;
import com.ssafy.ddukdoc.domain.document.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;

    public DocumentListResponseDto getDocumentList(DocumentSearchRequestDto documentSearchRequestDto, Pageable pageable){
        Page<DocumentListDto> documentList = documentRepository.findDocumentListByUserId(
                documentSearchRequestDto.getSendReceiveStatus(),
                documentSearchRequestDto.getTemplateCode(),
                documentSearchRequestDto.getStatus(),
                documentSearchRequestDto.getKeyword(),
                documentSearchRequestDto.getCreatedAt(),
                1,
                pageable
        );
        
        Integer UserId = 1; // 지금은 임시 값

        return DocumentListResponseDto.of(documentList.getContent());
    }

}

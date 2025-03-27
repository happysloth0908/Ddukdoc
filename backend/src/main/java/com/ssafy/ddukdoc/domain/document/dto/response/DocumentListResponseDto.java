package com.ssafy.ddukdoc.domain.document.dto.response;

import com.ssafy.ddukdoc.domain.document.entity.Document;
import com.ssafy.ddukdoc.domain.document.entity.DocumentStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class DocumentListResponseDto {
    private Integer documentId;
    private Integer templateId;
    private String templateCode;
    private String templateName;
    private String title;
    private String status;
    private Integer creatorId;
    private String creatorName;
    private Integer recipientId;
    private String recipientName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String returnReason;

    public static DocumentListResponseDto of(Document document) {
        return DocumentListResponseDto.builder()
                .documentId(document.getId())
                .templateId(document.getTemplate().getId())
                .templateCode(document.getTemplate().getCode())
                .templateName(document.getTemplate().getName())
                .title(document.getTitle())
                .status(document.getStatus().getDescription())
                .creatorId(document.getCreator().getId())
                .creatorName(document.getCreator().getName())
                .recipientId(document.getRecipient() != null ? document.getRecipient().getId() : null)
                .recipientName(document.getRecipient() != null ? document.getRecipient().getName() : null)
                .createdAt(document.getCreatedAt())
                .updatedAt(document.getUpdatedAt())
                .returnReason(document.getReturnReason())
                .build();
    }
}

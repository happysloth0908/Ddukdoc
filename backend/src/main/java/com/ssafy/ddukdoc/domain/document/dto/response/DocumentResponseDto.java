package com.ssafy.ddukdoc.domain.document.dto.response;

import com.ssafy.ddukdoc.domain.document.entity.Document;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class DocumentResponseDto {
    private Integer id;
    private String templateId;
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

    public static DocumentResponseDto of(Document document){
        return DocumentResponseDto.builder()
                .id(document.getId())
                .templateId(document.getTemplate().getCode())
                .templateName(document.getTemplate().getName())
                .title(document.getTitle())
                .status(document.getStatus().getDescription())
                .creatorId(document.getCreator().getId())
                .creatorName(document.getCreator().getName())
                .recipientId(document.getRecipient().getId())
                .recipientName(document.getRecipient().getName())
                .createdAt(document.getCreatedAt())
                .updatedAt(document.getUpdatedAt())
                .returnReason(document.getReturnReason())
                .build();
    }
}

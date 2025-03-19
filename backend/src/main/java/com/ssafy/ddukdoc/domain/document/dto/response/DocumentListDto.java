package com.ssafy.ddukdoc.domain.document.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class DocumentListDto {
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
}

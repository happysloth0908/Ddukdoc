package com.ssafy.ddukdoc.domain.document.dto.response;

import com.ssafy.ddukdoc.domain.document.entity.Document;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class DocumentListResponseDto {
    @Schema(example = "1")
    private Integer documentId;
    @Schema(example = "3")
    private Integer templateId;
    @Schema(example = "G1")
    private String templateCode;
    @Schema(example = "차용증")
    private String templateName;
    @Schema(example = "소운이 200만원 빌린 차용증 문서")
    private String title;
    @Schema(example = "서명 대기")
    private String status;
    @Schema(example = "1")
    private Integer creatorId;
    @Schema(example = "심발신")
    private String creatorName;
    @Schema(example = "2")
    private Integer recipientId;
    @Schema(example = "김수신")
    private String recipientName;
    @Schema(example = "2021-07-01T00:00:00")
    private LocalDateTime createdAt;
    @Schema(example = "2021-07-01T00:00:00")
    private LocalDateTime updatedAt;
    @Schema(example = "null")
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

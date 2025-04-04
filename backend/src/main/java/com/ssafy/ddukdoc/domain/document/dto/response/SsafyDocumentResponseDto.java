package com.ssafy.ddukdoc.domain.document.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ssafy.ddukdoc.domain.document.entity.Document;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SsafyDocumentResponseDto {

    @Schema(example = "1")
    private Integer documentId;
    @Schema(example = "3")
    private Integer templateId;
    @Schema(example = "S1")
    private String templateCode;
    @Schema(example = "출결소명서")
    private String templateName;
    @Schema(example = "김소운 출결소명서")
    private String title;
    @Schema(example = "서명 완료")
    private String status;
    @Schema(example = "10")
    private Integer creatorId;
    @Schema(example = "김소운")
    private String creatorName;
    @Schema(example = "2023-05-10T09:30:00")
    private LocalDateTime createdAt;
    @Schema(example = "2023-05-10T10:15:30")
    private LocalDateTime updatedAt;
    @Schema(example = "(base64)derzxfredfsdf")
    private String creatorSignature;

    // 상세 조회용: signature 값을 DB에서 가져와서 전달
    public static SsafyDocumentResponseDto of(Document document, String creatorSignature){
        return SsafyDocumentResponseDto.builder()
                .documentId(document.getId())
                .templateId(document.getTemplate().getId())
                .templateCode(document.getTemplate().getCode())
                .templateName(document.getTemplate().getName())
                .title(document.getTitle())
                .status(document.getStatus().getDescription())
                .creatorId(document.getCreator().getId())
                .creatorName(document.getCreator().getName())
                .createdAt(document.getCreatedAt())
                .updatedAt(document.getUpdatedAt())
                .creatorSignature(creatorSignature)
                .build();
    }
    
    // 목록 조회용 : document 값만 전달
    public static SsafyDocumentResponseDto of(Document document) {
        return of(document, null);
    }
}

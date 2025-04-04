package com.ssafy.ddukdoc.domain.material.dto.response;

import com.ssafy.ddukdoc.domain.material.entity.DocumentEvidence;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MaterialListResponseDto {
    @Schema(example = "1")
    private Integer materialId;
    @Schema(example = "계약서 첨부 자료")
    private String title;
    @Schema(example = "10")
    private Integer userId;
    @Schema(example = "홍길동")
    private String userName;
    @Schema(example = "pdf")
    private String format;
    @Schema(example = "2023-05-15T14:30:00")
    private LocalDateTime createdAt;
    @Schema(example = "2023-05-15T14:30:00")
    private LocalDateTime updatedAt;

    public static MaterialListResponseDto of(DocumentEvidence documentEvidence){
        return MaterialListResponseDto.builder()
                .materialId(documentEvidence.getId())
                .title(documentEvidence.getTitle())
                .userId(documentEvidence.getUser().getId())
                .userName(documentEvidence.getUser().getName())
                .format(documentEvidence.getMimeType())
                .createdAt(documentEvidence.getCreatedAt())
                .updatedAt(documentEvidence.getUpdatedAt())
                .build();
    }
}
